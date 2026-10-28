import { pool } from "../lib/db.js";
import { AdminTaskFilter } from "../types/admin.js";
import { Task } from "../types/task.js";

export interface AdminTaskListMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function findAllTasks(
  filters: AdminTaskFilter,
  page: number = 1,
  limit: number = 10,
): Promise<{ tasks: Task[]; metadata: AdminTaskListMetadata }> {
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), 100);

  // Get total count first
  const countConditions: string[] = [];
  const countValues: unknown[] = [];

  if (filters.search) {
    countConditions.push(`title ILIKE $${countValues.length + 1}`);
    countValues.push(`%${filters.search}%`);
  }

  if (filters.status) {
    countConditions.push(`status = $${countValues.length + 1}`);
    countValues.push(filters.status);
  }

  const countWhereClause =
    countConditions.length > 0 ? `WHERE ${countConditions.join(" AND ")}` : "";

  const countResult = await pool.query<{ count: string | null }>(
    `SELECT COUNT(*) FROM support_tasks ${countWhereClause}`,
    countValues,
  );

  const total = countResult.rows.length > 0 && countResult.rows[0]?.count
    ? parseInt(countResult.rows[0].count, 10)
    : 0;

  // Build pagination-aware query
  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (filters.search) {
    conditions.push(`title ILIKE $${paramIndex}`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  if (filters.status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(filters.status);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const offset = (pageNum - 1) * limitNum;

  const result = await pool.query<Task>(
    `
    SELECT id, title, status, user_id, created_at, updated_at FROM support_tasks
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limitNum, offset],
  );

  const totalPages = Math.ceil(total / limitNum);

  return {
    tasks: result.rows,
    metadata: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    },
  };
}