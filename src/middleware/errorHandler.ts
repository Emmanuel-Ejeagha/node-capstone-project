import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";
import { AppError } from "../errors/AppError.js";

type BodyParserError = Error & {
  status?: number;
  type?: string;
  body?: unknown;
};

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  const parserError = err as BodyParserError;

  if (
    err instanceof SyntaxError &&
    parserError.status === 400 &&
    parserError.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
    return;
  }

  logger.error({ err }, "Unhandled error");

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
