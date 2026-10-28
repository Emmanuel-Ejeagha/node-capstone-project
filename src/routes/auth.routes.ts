import { Router } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }
    await registerUser(email, password);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please login to continue",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken } = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", authenticate, async (req, res, next) => {
  try {
    // In a real implementation, you would:
    // 1. Add the refresh token to a revoked tokens list in Redis
    // 2. Set a short TTL on the refresh token to invalidate it
    // 3. Clear the refresh token from the client

    // For now, we'll just return success
    // TODO: Implement actual refresh token revocation in Redis
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
});
