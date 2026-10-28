import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { validateTaskId } from "../middleware/validation.middleware.js";
import { AdminTaskListQuery } from "../types/admin.js";
import { getAdminTasks, updateAdminTaskStatus } from "../services/admin.task.service.js";

export const adminTaskRouter = Router();

adminTaskRouter.use(authenticate, requireAdmin);

adminTaskRouter.use("/:taskId", validateTaskId);

adminTaskRouter.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { tasks, metadata } = await getAdminTasks(
      req.query as AdminTaskListQuery,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      data: { tasks },
      pagination: {
        page,
        limit: metadata.limit,
        totalPages: metadata.totalPages,
        totalItems: metadata.total,
      },
    });
  } catch (error) {
    next(error);
  }
});

adminTaskRouter.patch("/:taskId/status", async (req, res, next) => {
  try {
    const task = await updateAdminTaskStatus(
      req.params.taskId,
      req.body.status,
    );

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
});
