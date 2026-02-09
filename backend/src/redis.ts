import Redis from "ioredis";


const redisUrl = process.env.REDIS_URL!;

export const redis = new Redis(redisUrl);

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (e) => console.error("Redis error:", e));
