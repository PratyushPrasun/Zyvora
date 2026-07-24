import Counter from "../models/Counter.js";

const COUNTER_ID = "invoice";

/**
 * Generate a unique, sequential invoice number.
 *
 * Format: INV-YYYY-NNNNNN
 * Example: INV-2026-000001
 *
 * Uses MongoDB findOneAndUpdate with $inc for atomic
 * increment — safe under concurrent requests.
 *
 * @returns {Promise<string>} Unique invoice number
 */
export const generateInvoiceNumber = async () => {
    const year = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
        { _id: COUNTER_ID },
        { $inc: { seq: 1 } },
        {
            new: true,
            upsert: true,
        }
    );

    const sequence = String(counter.seq).padStart(6, "0");

    return `INV-${year}-${sequence}`;
};
