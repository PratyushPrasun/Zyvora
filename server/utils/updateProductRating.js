import Review from "../models/Review.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

const updateProductRating = async (productId) => {

    const stats = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId),
            },
        },
        {
            $group: {
                _id: "$product",
                averageRating: {
                    $avg: "$rating",
                },
                totalReviews: {
                    $sum: 1,
                },
            },
        },
    ]);

    if (stats.length > 0) {

        await Product.findByIdAndUpdate(productId, {
            averageRating: Number(stats[0].averageRating.toFixed(1)),
            totalReviews: stats[0].totalReviews,
        });

    } else {

        await Product.findByIdAndUpdate(productId, {
            averageRating: 0,
            totalReviews: 0,
        });

    }

};

export default updateProductRating;