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

/**
 * Get tasks for a user without pagination (original function).
 * @param userId - The user's ID
 * @returns Array of tasks
 */
export async function getUserTasks(
  userId: string,
): Promise<Task[]> {
  const result = await pool.query<Task>(
    `SELECT id, title, status, user_id, created_at, updated_at
    FROM support_tasks
    WHERE user_id = $1
    ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
}

/**
 * Get tasks for a user with pagination.
 * @param userId - The user's ID
 * @param page - The page number (1-indexed, default: 1)
 * @param limit - The number of items per page (default: 10, max: 100)
 * @returns Object containing tasks and total count for pagination
 */
export async function getUserTasksPaged(
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<{
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), 100);

  // Get total count
  const countResult = await pool.query<
    { count: string } | { count: null }
  >(
    `SELECT COUNT(*)::int AS count FROM support_tasks WHERE user_id = $1`,
    [userId],
  );

  const totalCountResult = countResult.rows[0] ?? null;
  const total = totalCountResult ? parseInt(totalCountResult?.count ?? "", 10) : 0;

  // Get paginated tasks
  const offset = (pageNum - 1) * limitNum;

  const result = await pool.query<Task>(
    `
    SELECT id, title, status, user_id, created_at, updated_at
    FROM support_tasks
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [userId, limitNum, offset],
  );

  const tasks = result.rows;
  const totalPages = Math.ceil(total / limitNum);

  return {
    tasks,
    total,
    page: pageNum,
    totalPages,
  };
}

/**
 * Find a task by ID and user ID.
 * @param taskId - The task's UUID
 * @param userId - The user's UUID
 * @returns The task if found, null otherwise
 */
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

/**
 * Update a task title.
 * @param taskId - The task's UUID
 * @param userId - The user's UUID
 * @param title - The new title
 * @returns The updated task, or null if not found
 */
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

/**
 * Delete a task.
 * @param taskId - The task's UUID
 * @param userid - The user's UUID
 * @returns True if deleted, false otherwise
 */
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

/**
 * Update task status.
 * @param taskId - The task's UUID
 * @param status - The new status
 * @returns The updated task, or null if not found
 */
export async function updateTaskStatus(
  taskId: string,
  status: string,
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    UPDATE support_tasks
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, title, status, user_id, created_at, updated_at
    `,
    [status, taskId],
  );

  return result.rows[0] ?? null;
}