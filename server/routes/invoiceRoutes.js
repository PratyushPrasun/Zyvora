import express from "express";

import {
    getInvoiceByOrder,
    downloadInvoicePdf,
    resendEmail,
    regeneratePdf,
} from "../controllers/invoiceController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// User routes (owner or admin)
router.get(
    "/order/:orderId",
    authMiddleware,
    getInvoiceByOrder
);

router.get(
    "/download/:orderId",
    authMiddleware,
    downloadInvoicePdf
);

// Admin-only routes
router.post(
    "/:invoiceId/resend-email",
    authMiddleware,
    adminMiddleware,
    resendEmail
);

router.post(
    "/:invoiceId/regenerate-pdf",
    authMiddleware,
    adminMiddleware,
    regeneratePdf
);

export default router;
