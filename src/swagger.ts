import express from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

const swaggerDocument = yaml.load(
  fs.readFileSync(path.resolve("./swagger.yaml"), "utf8")
) as object;

export function setupSwagger(app: express.Application) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/api-docs", (req, res) => {
    res.send(`<a href="/api-docs">Swagger UI</a>`);
  });
}