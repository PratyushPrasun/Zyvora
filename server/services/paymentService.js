import crypto, { randomUUID } from "crypto";
import mongoose from "mongoose";

import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.js";
import { createOrderFromCart } from "./orderService.js";
import {
    validateCart,
    validateStock,
    buildOrderItems,
    calculateOrderTotals,
} from "./orderService.js";
import Address from "../models/Address.js";

/**
 * Create a Razorpay Order
 */

export const createRazorpayOrder = async ({

    userId,

    addressId,

    session,

}) => {

    // -----------------------------
    // 1. Validate Address
    // -----------------------------

    const addressQuery = Address.findOne({

        _id: addressId,

        user: userId,

    });

    if (session) addressQuery.session(session);

    const address = await addressQuery;

    if (!address) {

        throw new Error("Address not found.");

    }

    // -----------------------------
    // 2. Validate Cart
    // -----------------------------

    const cart = await validateCart(

        userId,

        session

    );

    // -----------------------------
    // 3. Validate Stock
    // -----------------------------

    await validateStock(

        cart.items,

        session

    );

    // -----------------------------
    // 4. Calculate Total
    // -----------------------------

    const {

        subtotal,

    } = buildOrderItems(

        cart.items

    );

    const {

        shippingCharge,

        tax,

        discount,

        totalAmount,

    } = calculateOrderTotals(

        subtotal

    );



    // -----------------------------
    // 5. Create Razorpay Order
    // -----------------------------

    const razorpayOrder =
        await razorpay.orders.create({

            amount: Math.round(totalAmount * 100),

            currency: "INR",

            receipt: `rcpt_${new mongoose.Types.ObjectId().toString().slice(-16)}`,

            notes: {

                userId: userId.toString(),

                addressId: addressId.toString(),

            },

        });

    return {

        razorpayOrder,

        subtotal,

        shippingCharge,

        tax,

        discount,

        totalAmount,

    };

};

export const verifyRazorpayPayment = async ({

    userId,

    addressId,

    razorpayOrderId,

    razorpayPaymentId,

    razorpaySignature,

}) => {
    const expectedSignature = crypto
    .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
    )
    .update(
        `${razorpayOrderId}|${razorpayPaymentId}`
    )
    .digest("hex");

if (expectedSignature !== razorpaySignature) {

    throw new Error("Invalid payment signature.");

}

const razorpayPayment =
    await razorpay.payments.fetch(
        razorpayPaymentId
    );

    console.log(razorpayPayment);

if (
    razorpayPayment.status !== "captured" &&
    razorpayPayment.status !== "authorized"
) {
    throw new Error("Payment is not successful.");
}

if (

    razorpayPayment.order_id !== razorpayOrderId

) {

    throw new Error(
        "Order mismatch."
    );

}

const session =
    await mongoose.startSession();

try{

session.startTransaction();

const order =
await createOrderFromCart({

    userId,

    addressId,

    paymentMethod:"ONLINE",

    paymentStatus:"Paid",

    paymentInfo:{

        razorpayOrderId,

        razorpayPaymentId,

        razorpaySignature,

    },

    session,

});
const existingPayment = await Payment.findOne({
    gatewayPaymentId: razorpayPaymentId,
}).session(session);

if (existingPayment) {
    throw new Error("Payment already verified.");
}
const payment =
await Payment.create([{

    user:userId,

    order:order._id,

    gateway:"RAZORPAY",

    paymentMethod:"ONLINE",

    status:"Paid",

    amount:razorpayPayment.amount,

    currency:razorpayPayment.currency,

    gatewayOrderId:razorpayOrderId,

    gatewayPaymentId:razorpayPaymentId,

    gatewaySignature:razorpaySignature,

    paidAt:new Date(),

}],{

    session,

});

await session.commitTransaction();

return{

    order,

    payment:payment[0],

};

}
catch(error){

    await session.abortTransaction();

    throw error;

}
finally{

    session.endSession();

}

};