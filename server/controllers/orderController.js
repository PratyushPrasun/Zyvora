import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Address from "../models/Address.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { createOrderFromCart } from "../services/orderService.js";

// @desc Create Order
// @route POST /api/orders
// @access Private

export const createOrder = asyncHandler(async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const order = await createOrderFromCart({

            userId: req.user._id,

            addressId: req.body.addressId,

            paymentMethod: req.body.paymentMethod,

            paymentStatus:
                req.body.paymentMethod === "COD"
                    ? "Pending"
                    : "Paid",

            session,

        });

        await session.commitTransaction();

        res.status(201).json({

            success: true,

            order,

        });

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

});

// @desc Get Logged In User Orders
// @route GET /api/orders/my-orders
// @access Private

export const getMyOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({
        user: req.user._id
    })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: orders.length,
        orders
    });

});

// @desc Get Single Order
// @route GET /api/orders/:id
// @access Private

export const getOrderById = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id)
        .populate("user", "name email");

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found."
        });
    }

    // Security Check
    if (order.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access denied."
        });
    }

    res.status(200).json({
        success: true,
        order
    });

});

// @desc Get All Orders
// @route GET /api/orders
// @access Private/Admin

export const getAllOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: orders.length,
        orders
    });

});

// @desc Update Order Status
// @route PATCH /api/orders/:id/status
// @access Private/Admin

export const updateOrderStatus = asyncHandler(async (req, res) => {

    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found."
        });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order status updated.",
        order
    });

});