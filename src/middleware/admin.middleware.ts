import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "ADMIN") {
    next(
      new AppError(403, "Admin access required. You do not have admin access"),
    );
    return;
  }

  next();
}
