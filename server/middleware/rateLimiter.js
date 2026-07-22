import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 200,

    standardHeaders: true,

    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args) =>
            redisClient.sendCommand(args),
    }),

    message: {
        success: false,
        message: "Too many requests.",
    },
});