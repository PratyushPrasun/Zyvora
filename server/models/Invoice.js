import mongoose from "mongoose";

/**
 * Invoice Item Snapshot — immutable record of purchased product
 * at the time of invoice generation.
 */
const invoiceItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },

        sku: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            default: "",
        },

        quantity: {
            type: Number,
            required: true,
        },

        unitPrice: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        finalPrice: {
            type: Number,
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

/**
 * Shipping Address Snapshot — immutable copy of address
 * at purchase time.
 */
const shippingSnapshotSchema = new mongoose.Schema(
    {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        landmark: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: "India" },
    },
    { _id: false }
);

/**
 * Payment Snapshot — immutable copy of payment details.
 */
const paymentSnapshotSchema = new mongoose.Schema(
    {
        transactionId: { type: String, default: null },
        razorpayOrderId: { type: String, default: null },
        razorpayPaymentId: { type: String, default: null },
        paidAt: { type: Date, default: null },
    },
    { _id: false }
);

/**
 * Invoice Schema
 *
 * Represents a permanent, immutable invoice tied to an order.
 * All product, customer, and payment data is snapshot at
 * generation time and never changes.
 */
const invoiceSchema = new mongoose.Schema(
    {
        // ── Identifiers ────────────────────────────────

        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        invoiceUUID: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // ── References ─────────────────────────────────

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
            index: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },

        // ── Status ─────────────────────────────────────

        status: {
            type: String,
            enum: ["Generated", "Sent", "Downloaded", "Failed"],
            default: "Generated",
        },

        // ── Customer Snapshot ──────────────────────────

        customerName: {
            type: String,
            required: true,
        },

        customerEmail: {
            type: String,
            required: true,
        },

        customerPhone: {
            type: String,
            default: "",
        },

        customerId: {
            type: String,
            required: true,
        },

        // ── Shipping Snapshot ──────────────────────────

        shippingAddress: shippingSnapshotSchema,

        // ── Order Snapshot ─────────────────────────────

        orderNumber: {
            type: String,
            required: true,
        },

        orderDate: {
            type: Date,
            required: true,
        },

        orderStatus: {
            type: String,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true,
        },

        paymentStatus: {
            type: String,
            required: true,
        },

        // ── Payment Snapshot ───────────────────────────

        paymentSnapshot: paymentSnapshotSchema,

        // ── Items Snapshot ─────────────────────────────

        items: [invoiceItemSchema],

        // ── Totals Snapshot ────────────────────────────

        totalQuantity: {
            type: Number,
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        shippingCharge: {
            type: Number,
            default: 0,
        },

        tax: {
            type: Number,
            default: 0,
        },

        grandTotal: {
            type: Number,
            required: true,
        },

        // ── PDF Storage ────────────────────────────────

        pdfUrl: {
            type: String,
            default: null,
        },

        pdfPublicId: {
            type: String,
            default: null,
        },

        // ── Email Tracking ─────────────────────────────

        emailSent: {
            type: Boolean,
            default: false,
        },

        emailSentAt: {
            type: Date,
            default: null,
        },

        emailAttempts: {
            type: Number,
            default: 0,
        },

        // ── Metadata ───────────────────────────────────

        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for fast user invoice lookups
invoiceSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Invoice", invoiceSchema);
