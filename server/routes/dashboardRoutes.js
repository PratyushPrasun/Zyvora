import express from "express";

import { getDashboard } from "../controllers/dashboardController.js";
import { getAuditLogs } from "../controllers/auditController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboard
);

router.get(
    "/audit-logs",
    authMiddleware,
    adminMiddleware,
    getAuditLogs
);

export default router;