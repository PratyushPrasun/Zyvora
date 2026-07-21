import express from "express";

import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

// Admin Route
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    upload.array("images", 5),
    addProduct
);

router.put("/:id", authMiddleware,upload.array("images", 5), adminMiddleware, updateProduct);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;