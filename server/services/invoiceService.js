import { randomUUID } from "crypto";
import Invoice from "../models/Invoice.js";
import { generateInvoiceNumber } from "../utils/invoiceNumberGenerator.js";
import { generateInvoicePdf } from "./pdfService.js";
import {
    sendOrderConfirmationEmail,
    resendConfirmationEmail,
} from "./emailService.js";
import { enqueueEmail } from "../utils/emailQueue.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Upload PDF buffer to Cloudinary as raw file.
 *
 * @param {Buffer} buffer — PDF file buffer
 * @param {string} filename — Desired filename
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadPdfToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "invoices",
                resource_type: "raw",
                public_id: filename,
                overwrite: true,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        stream.end(buffer);
    });
};

/**
 * Build invoice snapshot from order + user + payment data.
 * This captures all data at purchase time so the invoice
 * remains unchanged even if source data changes later.
 *
 * @param {Object} order — Order document (populated)
 * @param {Object} user  — User document
 * @param {Object|null} payment — Payment document (null for COD)
 * @returns {Object} Invoice data ready for creation
 */
const buildInvoiceSnapshot = (order, user, payment) => {
    const items = (order.items || []).map((item) => ({
        productId: item.product,
        title: item.title,
        image: item.image || "",
        sku: "",
        category: "",
        quantity: item.quantity,
        unitPrice: item.price,
        discount: 0,
        finalPrice: item.price,
        subtotal: item.price * item.quantity,
    }));

    const totalQuantity = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const paymentSnapshot = payment
        ? {
              transactionId: payment.gatewayPaymentId || null,
              razorpayOrderId: payment.gatewayOrderId || null,
              razorpayPaymentId: payment.gatewayPaymentId || null,
              paidAt: payment.paidAt || null,
          }
        : {
              transactionId: null,
              razorpayOrderId: null,
              razorpayPaymentId: null,
              paidAt: null,
          };

    return {
        // References
        order: order._id,
        user: user._id,
        payment: payment?._id || null,

        // Customer snapshot
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
        customerId: user._id.toString(),

        // Shipping snapshot
        shippingAddress: order.shippingAddress
            ? { ...order.shippingAddress.toObject?.() ?? order.shippingAddress }
            : null,

        // Order snapshot
        orderNumber: order._id.toString().slice(-8).toUpperCase(),
        orderDate: order.createdAt,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,

        // Payment snapshot
        paymentSnapshot,

        // Items snapshot
        items,

        // Totals snapshot
        totalQuantity,
        subtotal: order.subtotal,
        discount: order.discount || 0,
        shippingCharge: order.shippingCharge || 0,
        tax: order.tax || 0,
        grandTotal: order.totalAmount,
    };
};

/**
 * Generate a complete invoice for an order.
 *
 * Orchestrates:
 * 1. Idempotency check
 * 2. Invoice number generation
 * 3. Snapshot creation
 * 4. PDF generation
 * 5. Cloudinary upload
 * 6. Database save
 * 7. Email queue
 *
 * If invoice already exists for this order, returns existing.
 * If PDF or email fails, order is NOT affected.
 *
 * @param {Object} order — Order document
 * @param {Object} user  — User document
 * @param {Object|null} payment — Payment document (null for COD)
 * @returns {Promise<Object>} Created or existing Invoice document
 */
export const generateInvoiceForOrder = async (
    order,
    user,
    payment = null
) => {
    // ── 1. Idempotency Check ───────────────────────────
    const existingInvoice = await Invoice.findOne({
        order: order._id,
    });

    if (existingInvoice) {
        console.log(
            `[INVOICE_SERVICE] ⏭️  Invoice already exists for order ${order._id}: ${existingInvoice.invoiceNumber}`
        );
        if (!existingInvoice.emailSent) {
            console.log(
                `[INVOICE_SERVICE] 📧 Queueing unsent email for invoice ${existingInvoice.invoiceNumber}`
            );
            enqueueEmail({
                label: `Order Confirmation — ${existingInvoice.invoiceNumber}`,
                handler: () => sendOrderConfirmationEmail(existingInvoice),
            });
        }
        return existingInvoice;
    }

    // ── 2. Generate Invoice Number ─────────────────────
    const invoiceNumber = await generateInvoiceNumber();
    const invoiceUUID = randomUUID();

    console.log(
        `[INVOICE_SERVICE] 🔢 Generated invoice number: ${invoiceNumber}`
    );

    // ── 3. Build Snapshot ──────────────────────────────
    const snapshotData = buildInvoiceSnapshot(order, user, payment);

    // ── 4. Create Invoice Document ─────────────────────
    const invoice = await Invoice.create({
        ...snapshotData,
        invoiceNumber,
        invoiceUUID,
        generatedAt: new Date(),
    });

    console.log(
        `[INVOICE_SERVICE] 📄 Invoice created: ${invoiceNumber} for order ${order._id}`
    );

    // ── 5. Generate PDF (non-blocking for order) ───────
    try {
        const pdfBuffer = await generateInvoicePdf(invoice);

        // ── 6. Upload to Cloudinary ────────────────────
        const { url, publicId } = await uploadPdfToCloudinary(
            pdfBuffer,
            `invoice-${invoiceNumber}`
        );

        // Update invoice with PDF location
        invoice.pdfUrl = url;
        invoice.pdfPublicId = publicId;
        await invoice.save();

        console.log(
            `[INVOICE_SERVICE] ☁️  PDF uploaded to Cloudinary: ${publicId}`
        );
    } catch (error) {
        console.error(
            `[INVOICE_SERVICE] ❌ PDF generation/upload failed for ${invoiceNumber}:`,
            error.message
        );
        // Invoice record exists but PDF is missing.
        // Can be regenerated later via admin action.
    }

    // ── 7. Queue Confirmation Email ────────────────────
    enqueueEmail({
        label: `Order Confirmation — ${invoiceNumber}`,
        handler: () => sendOrderConfirmationEmail(invoice),
    });

    return invoice;
};

/**
 * Get invoice by order ID.
 *
 * @param {string} orderId
 * @returns {Promise<Object|null>}
 */
export const getInvoiceByOrderId = async (orderId) => {
    return Invoice.findOne({ order: orderId });
};

/**
 * Get invoice by invoice ID.
 *
 * @param {string} invoiceId
 * @returns {Promise<Object|null>}
 */
export const getInvoiceById = async (invoiceId) => {
    return Invoice.findById(invoiceId);
};

/**
 * Regenerate PDF for an invoice.
 * Admin action — only if PDF is missing or corrupted.
 *
 * @param {string} invoiceId
 * @returns {Promise<Object>} Updated invoice
 */
export const regenerateInvoicePdf = async (invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
        throw new Error("Invoice not found.");
    }

    const pdfBuffer = await generateInvoicePdf(invoice);

    const { url, publicId } = await uploadPdfToCloudinary(
        pdfBuffer,
        `invoice-${invoice.invoiceNumber}`
    );

    invoice.pdfUrl = url;
    invoice.pdfPublicId = publicId;
    await invoice.save();

    console.log(
        `[INVOICE_SERVICE] 🔄 PDF regenerated for ${invoice.invoiceNumber}`
    );

    return invoice;
};

/**
 * Resend confirmation email for an invoice.
 * Admin action.
 *
 * @param {string} invoiceId
 * @returns {Promise<boolean>}
 */
export const resendInvoiceEmail = async (invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
        throw new Error("Invoice not found.");
    }

    const result = await resendConfirmationEmail(invoice);

    console.log(
        `[INVOICE_SERVICE] 📧 Email resent for ${invoice.invoiceNumber}`
    );

    return result;
};
