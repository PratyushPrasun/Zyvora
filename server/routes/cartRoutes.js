import express from "express";

import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/:productId", authMiddleware, updateCartItem);
router.delete("/:productId",authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);

export default router;