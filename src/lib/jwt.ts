import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayload } from "../types/user.js";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

export function signAccessToken(payload: TokenPayload) {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }
}
