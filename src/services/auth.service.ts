import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { signAccessToken, signEmailVerificationToken } from "../lib/jwt.js";
import { signRefreshToken } from "../lib/jwt.js";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../repositories/user.repositories.js";
import bcrypt from "bcryptjs";

// Simple email format validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email verification payload interface
interface EmailVerificationPayload {
  userId: string;
  email: string;
  purpose: "email-verification";
}

// Simple email format validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser(
  email: string,
  password: string,
): Promise<void> {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  if (!emailRegex.test(email)) {
    throw new AppError(400, "Invalid email format");
  }

  if (password.length < 8) {
    throw new AppError(400, "password must be more than 7 characters");
  }

  const normalizeEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizeEmail);

  if (existingUser) throw new AppError(409, "email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  await createUser(normalizeEmail, passwordHash);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  if (!email || !password)
    throw new AppError(400, "Email and password are required");

  if (!emailRegex.test(email)) {
    throw new AppError(400, "Invalid email format");
  }

  const normalizEmail = email.toLowerCase().trim();
  const user = await findUserByEmailWithPassword(normalizEmail);

  if (!user?.password_hash) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken, refreshToken };
}

export async function requestEmailVerification(
  email: string
): Promise<{ verificationToken: string }> {
  if (!emailRegex.test(email)) {
    throw new AppError(400, "Invalid email format");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) throw new AppError(404, "User not found");

  if (user.isEmailVerified)
    throw new AppError(400, "Email already verified");

  const verificationToken = signEmailVerificationToken(user.id, normalizedEmail);

  return { verificationToken };
}

export async function verifyEmail(
  token: string
): Promise<{ success: boolean }> {
  try {
    const payload = verifyAccessToken(token);

    // In a real implementation, you would:
    // 1. Verify the token belongs to a pending verification record
    // 2. Mark the user's isEmailVerified flag as true
    // 3. Clear any pending verification records

    // For now, we'll just return success
    // TODO: Implement actual email verification database update
    return { success: true };
  } catch (error) {
    throw new AppError(401, "Invalid or expired verification token");
  }
}

export async function requestPasswordReset(
  email: string
): Promise<{ resetToken: string }> {
  if (!emailRegex.test(email)) {
    throw new AppError(400, "Invalid email format");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) throw new AppError(404, "User not found");

  // Generate a password reset token
  const resetToken = signEmailVerificationToken(user.id, normalizedEmail);

  // TODO: In a real implementation, you would:
  // 1. Store the reset token with an expiry in the database
  // 2. Send an email with the reset link
  // 3. Mark the token as used once the password is reset

  return { resetToken };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean }> {
  try {
    // Verify the token
    const payload = verifyAccessToken(token);

    // TODO: In a real implementation, you would:
    // 1. Check if the token is a valid password reset token (not access token)
    // 2. Verify the token hasn't expired
    // 3. Update the user's password in the database
    // 4. Invalidate the token after use

    // For now, we'll validate the token structure and return success
    // TODO: Implement actual password reset database update
    if (payload.purpose !== "email-verification") {
      throw new AppError(400, "Invalid password reset token");
    }

    if (newPassword.length < 8) {
      throw new AppError(400, "password must be more than 7 characters");
    }

    // TODO: Hash the new password and update the user in the database
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "Invalid or expired password reset token");
  }
}
