import Review from "../models/Review.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import asyncHandler from "../middleware/asyncHandler.js";
import updateProductRating from "../utils/updateProductRating.js";

// @desc Get Product Reviews
// @route GET /api/products/:id/reviews
// @access Public

export const getProductReviews = asyncHandler(async (req, res) => {

    const productId = req.params.id;

    const reviews = await Review.find({ product: productId })
        .populate("user", "name")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
    });

});

// @desc Add Product Review
// @route POST /api/products/:id/reviews
// @access Private

export const addReview = asyncHandler(async (req, res) => {

    const productId = req.params.id;

    const {
        rating,
        title,
        comment
    } = req.body;

    // Validate Rating
    if (!rating || rating < 1 || rating > 5) {

        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5."
        });

    }

    if (!comment) {

        return res.status(400).json({
            success: false,
            message: "Comment is required."
        });

    }

    // Product Exists?
    const product = await Product.findById(productId);

    if (!product) {

        return res.status(404).json({
            success: false,
            message: "Product not found."
        });

    }

    // Has User Purchased This Product?
    const hasPurchased = await Order.findOne({

        user: req.user._id,

        "items.product": productId,

        orderStatus: "Delivered"

    });

    if (!hasPurchased) {

        return res.status(403).json({
            success: false,
            message: "You can review only delivered products that you have purchased."
        });

    }

    // Already Reviewed?
    const existingReview = await Review.findOne({

        user: req.user._id,

        product: productId

    });

    if (existingReview) {

        return res.status(409).json({
            success: false,
            message: "You have already reviewed this product."
        });

    }

    // Create Review
    const review = await Review.create({

        product: productId,

        user: req.user._id,

        rating,

        title,

        comment,

        isVerifiedPurchase: true

    });

    // Update Product Rating
    await updateProductRating(productId);

    res.status(201).json({

        success: true,

        message: "Review added successfully.",

        review

    });

});

// @desc Update Review
// @route PUT /api/products/:id/reviews
// @access Private

export const updateReview = asyncHandler(async (req, res) => {

    const productId = req.params.id;

    const { rating, title, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5.",
        });
    }

    if (!comment) {
        return res.status(400).json({
            success: false,
            message: "Comment is required.",
        });
    }

    // Find Review
    const review = await Review.findOneAndUpdate(
    {
        product: productId,
        user: req.user._id,
    },
    {
        rating,
        title,
        comment,
    },
    {
        new: true,
        runValidators: true,
    }
);

if (!review) {
    return res.status(404).json({
        success: false,
        message: "Review not found.",
    });
}

    // Update product rating
    await updateProductRating(productId);

    res.status(200).json({
        success: true,
        message: "Review updated successfully.",
        review,
    });

});

// @desc Delete Review
// @route DELETE /api/products/:id/reviews
// @access Private

export const deleteReview = asyncHandler(async (req, res) => {

    const productId = req.params.id;

    const review = await Review.findOneAndDelete({
    product: productId,
    user: req.user._id,
});

if (!review) {
    return res.status(404).json({
        success: false,
        message: "Review not found.",
    });
}

    // Update Product Rating
    await updateProductRating(productId);

    res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
    });

});