import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../lib/jwt.js";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Access token is required"));
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    next(new AppError(401, "Access token required"));
    return;
  }

  req.user = verifyAccessToken(token);

  next();
}
