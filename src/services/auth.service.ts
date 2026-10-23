import { AppError } from "../errors/AppError.js";
import { signAccessToken } from "../lib/jwt.js";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../repositories/user.repositories.js";
import bcrypt from "bcryptjs";

export async function registerUser(
  email: string,
  password: string,
): Promise<void> {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
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
): Promise<{ accessToken: string }> {
  if (!email || !password)
    throw new AppError(400, "Email and password are required");

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

  return { accessToken };
}
