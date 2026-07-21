import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            // index: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            set: (value) => value.replace(/\s+/g, ""),
        },

        addressLine1: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        addressLine2: {
            type: String,
            trim: true,
            default: "",
            maxlength: 200,
        },

        landmark: {
            type: String,
            trim: true,
            default: "",
            maxlength: 100,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        pincode: {
            type: String,
            required: true,
            match: /^\d{6}$/,
        },

        country: {
            type: String,
            default: "India",
            trim: true,
        },

        addressType: {
            type: String,
            enum: ["Home", "Office", "Other"],
            default: "Home",
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Fast lookup of a user's addresses
addressSchema.index({
    user: 1,
});

// Fast lookup of default address
addressSchema.index({
    user: 1,
    isDefault: 1,
});

export default mongoose.model("Address", addressSchema);