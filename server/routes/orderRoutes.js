import express from "express";

import {

    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus

} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/my-orders/:id", authMiddleware, getOrderById);
router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);

export default router;