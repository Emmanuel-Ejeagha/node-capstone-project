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
