import express from "express";

import {
    getProductReviews,
    addReview,
    deleteReview,
    updateReview
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/:id/reviews",
    getProductReviews
);

router.post(
    "/:id/reviews",
    authMiddleware,
    addReview
);

router.put(
    "/:id/reviews",
    authMiddleware,
    updateReview
);

router.delete(
    "/:id/reviews",
    authMiddleware,
    deleteReview
);

export default router;