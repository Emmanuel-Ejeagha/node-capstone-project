import { AppError } from "../errors/AppError.js";
import { pool } from "../lib/db.js";
import { Task } from "../types/task.js";

type TaskRow = Task;

export async function createTask(userId: string, title: string): Promise<Task> {
  const result = await pool.query<TaskRow>(
    `INSERT INTO support_tasks (title, user_id)
    VALUES ($1, $2)
    RETURNING id, title, status, user_id, created_at, updated_at`,
    [title, userId],
  );

  const task = result.rows[0];

  if (!task) {
    throw new AppError(500, "Failed to create task");
  }

  return task;
}

export async function getUserTaskByUserId(userId: string): Promise<Task[]> {
  const result = await pool.query<Task>(
    `SELECT id, title, status, user_id, created_at, updated_at 
    FROM support_tasks
    WHERE user_id = $1
    ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
}

export async function findTaskByIdAndUserId(
  taskId: string,
  userId: string,
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    SELECT id, title, status, user_id, created_at, updated_at
    FROM support_tasks
    WHERE id = $1 AND user_id = $2
    `,
    [taskId, userId],
  );

  return result.rows[0] ?? null;
}

export async function updateTaskTitle(
  taskId: string,
  userId: string,
  title: string,
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    UPDATE support_tasks
    SET title = $1, updated_at = NOW()
    WHERE id = $2 AND user_id = $3
    RETURNING id, title, status, user_id, created_at, updated_at
    `,
    [title, taskId, userId],
  );

  const task = result.rows[0];

  if (!task) {
    throw new AppError(404, "Task title not found");
  }

  return task;
}

export async function deleteTask(
  taskId: string,
  userid: string,
): Promise<boolean> {
  const result = await pool.query<Task>(
    `
    DELETE FROM support_tasks
    WHERE id = $1 AND user_id = $2`,
    [taskId, userid],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function updateTaskStatus(
  taskId: string,
  status: string,
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    UPDATE support_tasks
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, title, status, user_id, created_at, updated_at`,
    [status, taskId],
  );

  return result.rows[0] ?? null;
}
