import Redis from "ioredis";

export const redis = new Redis({
  host: "192.168.1.10",
  port: 6379,
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (e) => console.error("Redis error:", e));
