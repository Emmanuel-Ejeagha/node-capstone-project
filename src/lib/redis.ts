import { Redis } from "ioredis";
import { env } from "../config/env.js";

export const redis = new Redis(env.redisUrl);

const redisUrl = new URL(env.redisUrl);

export const bullmqConnection = {
  host: redisUrl.hostname,
  port: redisUrl.port,
  maxRetriesPerRequest: null,
};

redis.on("error", (error) => {
  console.error("[Redis Connection Error]", error.message);
});

redis.on("ready", () => {
  console.info("[Redis] Connection ready");
});
