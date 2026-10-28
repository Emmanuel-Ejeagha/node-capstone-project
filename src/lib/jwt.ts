import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayload } from "../types/user.js";
import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";

const REQUIRED_CLAIMS = ["userId", "email", "role"];

export function signAccessToken(payload: TokenPayload) {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function signRefreshToken(payload: TokenPayload) {
  const options: SignOptions = {
    expiresIn: env.jwtRefreshExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtRefreshSecret, options);
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const payload = jwt.verify(token, env.jwtRefreshSecret) as Record<string, unknown>;

    // Validate that all required claims are present
    for (const claim of REQUIRED_CLAIMS) {
      if (!payload[claim]) {
        throw new AppError(
          401,
          `Invalid token: missing required claim "${claim}"`,
        );
      }
    }

    return payload as TokenPayload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "Invalid or expired refresh token");
  }
}

export function signEmailVerificationToken(userId: string, email: string): string {
  const payload = {
    userId,
    email,
    purpose: "email-verification" as const,
  };

  const options: SignOptions = {
    expiresIn: "15m",
  };

  return jwt.sign(payload, env.jwtAccessSecret, options);
}
