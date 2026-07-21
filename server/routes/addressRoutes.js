import express from "express";

import {
    addAddress,
    getMyAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from "../controllers/addressController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(authMiddleware, addAddress)
    .get(authMiddleware, getMyAddresses);

router.route("/:id")
    .get(authMiddleware, getAddressById)
    .put(authMiddleware, updateAddress)
    .delete(authMiddleware, deleteAddress);

router.patch(
    "/:id/default",
    authMiddleware,
    setDefaultAddress
);

export default router;