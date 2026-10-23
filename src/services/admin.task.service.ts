import { TASK_STATUS } from "../consts/taskStatus.js";
import { AppError } from "../errors/AppError.js";
import { findAllTasks } from "../repositories/admin.task.repositories.js";
import { updateTaskStatus } from "../repositories/user.task.repositories.js";
import {
  AdminTaskListQuery,
  AdminTaskListResponse,
  TaskStatus,
} from "../types/admin.js";
import { Task } from "../types/task.js";

export async function getAdminTasks(
  query: AdminTaskListQuery,
): Promise<AdminTaskListResponse> {
  const search = query.search?.trim() || undefined;
  const status = query.status?.trim() || undefined;

  if (status && !TASK_STATUS.includes(status as TaskStatus)) {
    throw new AppError(
      400,
      "Status must be between open, inprogress or resolved",
    );
  }

  const tasks = await findAllTasks({ search, status });

  return { tasks };
}

export async function updateAdminTaskStatus(
  taskId: string,
  status: unknown,
): Promise<Task> {
  if (
    typeof status !== "string" ||
    !TASK_STATUS.includes(status as TaskStatus)
  ) {
    throw new AppError(
      400,
      "status must be between open, inprogress or resolved",
    );
  }

  const task = await updateTaskStatus(taskId, status);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return task;
}
