import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { authRouter } from "./auth.routes.js";
import { userTaskRouter } from "./user.tasks.routes.js";
import { adminTaskRouter } from "./admin.tasks.routes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", userTaskRouter);
apiRouter.use("/admin/tasks", adminTaskRouter);
