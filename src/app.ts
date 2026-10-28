import express from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { apiRouter } from "./routes/index.js";
import { env } from "./config/env.js";
import { env as validatedEnv } from "./config/validateEnv.js";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API documentation setup
const swaggerDocument = yaml.load(
  fs.readFileSync(path.resolve("./swagger.yaml"), "utf8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);

return app;