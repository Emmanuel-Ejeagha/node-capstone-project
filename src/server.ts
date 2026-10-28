import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

const app = createApp();

const server = app.listen(env.port, "127.0.0.1", () => {
  logger.info({ address: server.address() }, "HTTP server is listening");
});

server.on("error", (err) => {
  logger.error({ err }, "HTTP server failed to start");
});

// Graceful shutdown handling
const shutdown = async (signal: string) => {
  logger.info({ signal }, "Received shutdown signal. Starting graceful shutdown...");

  // Close HTTP server
  server.close(() => {
    logger.info("HTTP server closed");
  });

  // Close database pool
  // TODO: Import and close pg pool here
  // await pgPool.end();

  // Close Redis connection
  // TODO: Import and close Redis connection here
  // await redis.quit();

  // Wait for all BullMQ jobs to complete or be paused
  // TODO: Import and gracefully shutdown workers
  // await workerManager.shutdown();

  setTimeout(() => {
    process.exit(1);
  }, 30000); // Wait 30 seconds for connections to close
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
