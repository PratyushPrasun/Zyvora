import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";


// @desc Register User
// @route POST /api/auth/register
// @access Public

export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: "Registration Successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });

});




// @desc Login User
// @route POST /api/auth/login
// @access Public

export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }

    // password is hidden because select:false
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials"
        });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials"
        });
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });

});




// @desc Get Profile
// @route GET /api/auth/profile
// @access Private

export const getProfile = asyncHandler(async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    });

});