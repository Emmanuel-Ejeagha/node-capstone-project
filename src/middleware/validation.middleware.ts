import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

/**
 * Validates that a string is a valid UUID v4 format.
 * Returns false for empty strings, null, undefined, or non-UUID formats.
 */
export function validateUUID(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);
}

/**
 * Middleware that validates the taskId route parameter is a valid UUID.
 * If invalid, responds with 400 and calls next() with AppError.
 */
export function validateTaskId(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const { taskId } = req.params;

  if (!validateUUID(taskId)) {
    next(new AppError(400, "Invalid task ID format. Must be a valid UUID v4."));
    return;
  }

  next();
}

/**
 * Middleware that validates required fields are present in the request body.
 * @param requiredFields - List of field names that must exist in req.body
 */
export function validateRequiredBodyFields(
  this: void,
  requiredFields: string[],
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (!(field in req.body)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      next(
        new AppError(
          400,
          `Missing required field${
            missingFields.length > 1 ? "s" : ""
          }: ${missingFields.join(", ")}`,
        ),
      );
      return;
    }

    next();
  };
}