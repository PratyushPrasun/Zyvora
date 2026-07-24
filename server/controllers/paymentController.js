import asyncHandler from "../middleware/asyncHandler.js";

import {
    createRazorpayOrder,
    verifyRazorpayPayment,
} from "../services/paymentService.js";

import { generateInvoiceForOrder } from "../services/invoiceService.js";


// @desc Create Razorpay Order
// @route POST /api/payments/create-order
// @access Private

export const createPaymentOrder = asyncHandler(async (req, res) => {

    const { addressId } = req.body;

    const data = await createRazorpayOrder({

        userId: req.user._id,

        addressId,

    });

    res.status(201).json({

        success: true,

        message: "Razorpay order created successfully.",

        key: process.env.RAZORPAY_KEY_ID,

        ...data,

    });

});


// @desc Verify Razorpay Payment
// @route POST /api/payments/verify
// @access Private

export const verifyPayment = asyncHandler(async (req, res) => {

    const {

        addressId,

        razorpayOrderId,

        razorpayPaymentId,

        razorpaySignature,

    } = req.body;

    const result = await verifyRazorpayPayment({

        userId: req.user._id,

        addressId,

        razorpayOrderId,

        razorpayPaymentId,

        razorpaySignature,

    });

    // Trigger invoice generation (async, non-blocking)
    generateInvoiceForOrder(result.order, req.user, result.payment)
        .catch((err) =>
            console.error(
                "[INVOICE] Online payment invoice generation failed:",
                err.message
            )
        );

    res.status(200).json({

        success: true,

        message: "Payment verified successfully.",

        order: result.order,

        payment: result.payment,

    });

});