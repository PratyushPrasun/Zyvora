import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";

let redisLimiter;
let memoryLimiter;

export const apiLimiter = (req, res, next) => {
    // If Redis is connected, use the Redis-backed rate limiter
    if (redisClient.isOpen) {
        if (!redisLimiter) {
            redisLimiter = rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 200,
                standardHeaders: true,
                legacyHeaders: false,
                store: new RedisStore({
                    sendCommand: (...args) => redisClient.sendCommand(args),
                }),
                message: {
                    success: false,
                    message: "Too many requests.",
                },
            });
        }
        return redisLimiter(req, res, next);
    } else {
        // Fallback to in-memory rate limiter if Redis is offline/closed
        if (!memoryLimiter) {
            console.warn("⚠️ Redis is not connected. Falling back to in-memory rate limiting.");
            memoryLimiter = rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 200,
                standardHeaders: true,
                legacyHeaders: false,
                message: {
                    success: false,
                    message: "Too many requests.",
                },
            });
        }
        return memoryLimiter(req, res, next);
    }
};