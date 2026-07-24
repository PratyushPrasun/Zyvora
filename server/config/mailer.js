import "./env.js";
import nodemailer from "nodemailer";

/**
 * Nodemailer transporter configured from environment variables.
 *
 * Supports any SMTP provider (Gmail, SendGrid, Mailgun, AWS SES, etc.)
 * by setting the appropriate SMTP_* environment variables.
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Verify SMTP connection on startup (non-blocking).
 * Logs warning if configuration is missing or invalid.
 */
transporter.verify()
    .then(() => {
        console.log("✅ SMTP Mail Server Connected");
    })
    .catch((err) => {
        console.warn(
            "⚠️  SMTP connection failed — emails will not be sent:",
            err.message
        );
    });

export default transporter;
