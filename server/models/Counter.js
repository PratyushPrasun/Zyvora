import mongoose from "mongoose";

/**
 * Generic atomic counter model.
 * Used for generating sequential, unique identifiers
 * (e.g., invoice numbers) safe under concurrent requests.
 */
const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },

    seq: {
        type: Number,
        default: 0,
    },
});

export default mongoose.model("Counter", counterSchema);
