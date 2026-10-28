import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateTaskId } from "../middleware/validation.middleware.js";
import {
  createUserTask,
  deleteUserTask,
  getUserTaskById,
  getUserTasks,
  getUserTasksPaged,
  updateUserTask,
} from "../services/user.task.service.js";

export const userTaskRouter = Router();

userTaskRouter.use(authenticate);

userTaskRouter.use("/:taskId", validateTaskId);

userTaskRouter.post("/", async (req, res, next) => {
  try {
    const task = await createUserTask(req.user!.userId, req.body.title);

    res.status(201).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
});

userTaskRouter.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { tasks, totalPages, total } = await getUserTasksPaged(
      req.user!.userId,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      data: { tasks },
      pagination: {
        page,
        limit,
        totalPages,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
});

userTaskRouter.get("/:taskId", async (req, res, next) => {
  try {
    const task = await getUserTaskById(req.params.taskId, req.user!.userId);
    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
});

userTaskRouter.patch("/:taskId", async (req, res, next) => {
  try {
    const task = await updateUserTask(
      req.params.taskId,
      req.user!.userId,
      req.body.title,
    );

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
});

userTaskRouter.delete("/:taskId", async (req, res, next) => {
  try {
    await deleteUserTask(req.params.taskId, req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});