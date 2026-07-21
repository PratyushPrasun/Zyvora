import Address from "../models/Address.js";
import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";


// @desc    Add New Address
// @route   POST /api/addresses
// @access  Private

export const addAddress = asyncHandler(async (req, res) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            pincode,
            country,
            addressType,
            isDefault,
        } = req.body;

        // Count existing addresses
        const addressCount = await Address.countDocuments({
            user: req.user._id,
        }).session(session);

        let makeDefault = false;

        // First address is always default
        if (addressCount === 0) {

            makeDefault = true;

        }
        // User explicitly selected default
        else if (isDefault === true) {

            await Address.updateMany(
                {
                    user: req.user._id,
                    isDefault: true,
                },
                {
                    $set: {
                        isDefault: false,
                    },
                },
                {
                    session,
                }
            );

            makeDefault = true;

        }

        const address = await Address.create(
            [
                {
                    user: req.user._id,

                    fullName,

                    phone,

                    addressLine1,

                    addressLine2,

                    landmark,

                    city,

                    state,

                    pincode,

                    country,

                    addressType,

                    isDefault: makeDefault,
                },
            ],
            {
                session,
            }
        );

        await session.commitTransaction();

        session.endSession();

        res.status(201).json({

            success: true,

            message: "Address added successfully.",

            address: address[0],

        });

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

});


// @desc    Set Default Address
// @route   PATCH /api/addresses/:id/default
// @access  Private

export const setDefaultAddress = asyncHandler(async (req, res) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid address ID.",
            });

        }

        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).session(session);

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new Error("Invalid address ID.");
        }

        if (!address) {
            throw new Error("Address not found.");
        }

        // Already default
        if (address.isDefault) {

            await session.commitTransaction();

            session.endSession();

            return res.status(200).json({

                success: true,

                message: "Address is already the default.",

                address,

            });

        }

        // Remove previous default
        await Address.updateMany(
            {
                user: req.user._id,
                isDefault: true,
            },
            {
                $set: {
                    isDefault: false,
                },
            },
            {
                session,
            }
        );

        // Set new default
        address.isDefault = true;

        await address.save({
            session,
        });

        await session.commitTransaction();

        session.endSession();

        res.status(200).json({

            success: true,

            message: "Default address updated successfully.",

            address,

        });

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

});


// ==========================================
// @desc    Get My Addresses
// @route   GET /api/addresses
// @access  Private
// ==========================================
export const getMyAddresses = asyncHandler(async (req, res) => {

    const addresses = await Address.find({
        user: req.user._id,
    })
        .select("-__v")
        .sort({
            isDefault: -1,
            updatedAt: -1,
        })
        .lean();

    res.status(200).json({
        success: true,
        count: addresses.length,
        addresses,
    });

});


// ==========================================
// @desc    Get Address By ID
// @route   GET /api/addresses/:id
// @access  Private
// ==========================================
export const getAddressById = asyncHandler(async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid address ID.",
        });
    }

    const address = await Address.findOne({
        _id: req.params.id,
        user: req.user._id,
    })
        .select("-__v")
        .lean();

    if (!address) {
        return res.status(404).json({
            success: false,
            message: "Address not found.",
        });
    }

    res.status(200).json({
        success: true,
        address,
    });

});


// @desc    Update Address
// @route   PUT /api/addresses/:id
// @access  Private

export const updateAddress = asyncHandler(async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid address ID.",
        });
    }

    const address = await Address.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!address) {
        return res.status(404).json({
            success: false,
            message: "Address not found.",
        });
    }

    const allowedFields = [
        "fullName",
        "phone",
        "addressLine1",
        "addressLine2",
        "landmark",
        "city",
        "state",
        "pincode",
        "country",
        "addressType",
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            address[field] = req.body[field];
        }
    });

    await address.save();

    res.status(200).json({
        success: true,
        message: "Address updated successfully.",
        address,
    });

});

// ==========================================
// @desc    Delete Address
// @route   DELETE /api/addresses/:id
// @access  Private
// ==========================================

export const deleteAddress = asyncHandler(async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid address ID.",
        });
    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).session(session);

        if (!address) {
            throw new Error("Address not found.");
        }

        const wasDefault = address.isDefault;

        await address.deleteOne({ session });

        if (wasDefault) {

            const nextDefault = await Address.findOneAndUpdate(
                {
                    user: req.user._id,
                },
                {
                    $set: {
                        isDefault: true,
                    },
                },
                {
                    sort: {
                        createdAt: 1,
                    },
                    new: true,
                    session,
                }
            );

if (nextDefault) {

    nextDefault.isDefault = true;

    await nextDefault.save({ session });

}

        }

await session.commitTransaction();

res.status(200).json({
    success: true,
    message: "Address deleted successfully.",
});

    } catch (error) {

    await session.abortTransaction();

    throw error;

} finally {

    session.endSession();

}

});