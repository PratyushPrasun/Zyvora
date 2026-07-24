import "./config/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import productRoutes from "./routes/productRoutes.js";

import reviewRoutes from "./routes/reviewRoutes.js";

import cartRoutes from "./routes/cartRoutes.js";

import orderRoutes from "./routes/orderRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

import addressRoutes from "./routes/addressRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";

import invoiceRoutes from "./routes/invoiceRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

import { connectRedis } from "./config/redis.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

// Connect Database
connectDB();
connectRedis();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);

// Global Error Handler
app.use(errorMiddleware);

app.use(apiLimiter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});