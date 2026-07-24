import transporter from "../config/mailer.js";
import storeConfig from "../config/store.js";
import { buildOrderConfirmationHtml } from "../templates/orderConfirmationTemplate.js";
import Invoice from "../models/Invoice.js";

export const sendOrderConfirmationEmail = async (invoice) => {
    // Idempotency guard — never send duplicate emails
    if (invoice.emailSent) {
        console.log(
            `[EMAIL_SERVICE] ⏭️  Email already sent for ${invoice.invoiceNumber}. Skipping.`
        );
        return false;
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const smtpFrom =
        process.env.SMTP_FROM || `"${storeConfig.name}" <${storeConfig.email}>`;

    const html = buildOrderConfirmationHtml(invoice, clientUrl);

    const mailOptions = {
        from: smtpFrom,
        to: invoice.customerEmail,
        subject: `Order Confirmation — ${invoice.orderNumber} | ${storeConfig.name}`,
        html,
    };

    await transporter.sendMail(mailOptions);

    // Mark email as sent
    await Invoice.findByIdAndUpdate(invoice._id, {
        emailSent: true,
        emailSentAt: new Date(),
        $inc: { emailAttempts: 1 },
        status: "Sent",
    });

    console.log(
        `[EMAIL_SERVICE] ✅ Confirmation email sent to ${invoice.customerEmail} for ${invoice.invoiceNumber}`
    );

    return true;
};

/**
 * Resend confirmation email (admin action).
 * Resets emailSent flag and sends again.
 *
 * @param {Object} invoice — Invoice document
 * @returns {Promise<boolean>}
 */
export const resendConfirmationEmail = async (invoice) => {
    // Reset the flag so send function proceeds
    await Invoice.findByIdAndUpdate(invoice._id, {
        emailSent: false,
    });

    // Reload to get updated document
    const updatedInvoice = await Invoice.findById(invoice._id);

    return sendOrderConfirmationEmail(updatedInvoice);
};
