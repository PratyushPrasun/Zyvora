import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        // User who made the payment
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Associated Order
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
            index: true,
        },

        // Payment Gateway
        gateway: {
            type: String,
            enum: ["RAZORPAY"],
            default: "RAZORPAY",
            required: true,
        },

        // COD / ONLINE
        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true,
        },

        // Payment Status
        status: {
            type: String,
            enum: [
                "Created",
                "Pending",
                "Authorized",
                "Captured",
                "Paid",
                "Failed",
                "Refunded",
            ],
            default: "Created",
            index: true,
        },

        // Amount in smallest currency unit (Paise)
        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        // Razorpay IDs
        gatewayOrderId: {
            type: String,
            default: null,
            index: true,
        },

        gatewayPaymentId: {
            type: String,
            default: null,
            index: true,
        },

        gatewaySignature: {
            type: String,
            default: null,
        },

        // Optional payment metadata
        metadata: {
            type: Object,
            default: {},
        },

        // Failure Reason
        failureReason: {
            type: String,
            default: null,
        },

        // Refund Information
        refundId: {
            type: String,
            default: null,
        },

        refundedAt: {
            type: Date,
            default: null,
        },

        // Successful Payment Time
        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Payment", paymentSchema);