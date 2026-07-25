import redisClient from "../config/redis.js";

export const getCache = async (key) => {
    try {
        if (!redisClient || !redisClient.isOpen) return null;
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Redis getCache error:", err);
        return null;
    }
};

export const setCache = async (key, value, ttl = 300) => {
    try {
        if (!redisClient || !redisClient.isOpen) return;
        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: ttl,
            }
        );
    } catch (err) {
        console.error("Redis setCache error:", err);
    }
};

export const deleteCache = async (key) => {
    try {
        if (!redisClient || !redisClient.isOpen) return;
        await redisClient.del(key);
    } catch (err) {
        console.error("Redis deleteCache error:", err);
    }
};

export const deleteCacheByPattern = async (pattern) => {
    try {
        if (!redisClient || !redisClient.isOpen) return;
        const keys = await redisClient.keys(pattern);
        if (keys && keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.error("Redis deleteCacheByPattern error:", err);
    }
};