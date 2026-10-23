import { pool } from "../lib/db.js";
import { AdminTaskFilter } from "../types/admin.js";
import { Task } from "../types/task.js";

export async function findAllTasks(filters: AdminTaskFilter): Promise<Task[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  let paramIndex = 1;

  if (filters.search) {
    conditions.push(`title ILIKE $${paramIndex}`);
    values.push(`%${filters.search}%`);
  }

  if (filters.status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(filters.status);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query<Task>(
    `
    SELECT id, title, status, user_id, created_at, updated_at FROM support_tasks
    ${whereClause}
    ORDER BY created_at DESC`,
    values,
  );

  return result.rows;
}
