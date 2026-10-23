import { AppError } from "../errors/AppError.js";
import { pool } from "../lib/db.js";
import { DbUserRow, DbUserWithPasswordRow, User } from "../types/user.js";

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<DbUserRow>(
    "SELECT id, email, role, created_at FROM users WHERE email = $1",
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
): Promise<User> {
  const result = await pool.query<DbUserRow>(
    `
  INSERT INTO users (email, password_hash)
  VALUES ($1, $2)
  RETURNING id, email, role, created_at
  `,
    [email, passwordHash],
  );

  const user = result.rows[0];
  if (!user) throw new AppError(400, "Failed to create user");

  return user;
}

export async function findUserByEmailWithPassword(
  email: string,
): Promise<DbUserWithPasswordRow | null> {
  const result = await pool.query<DbUserWithPasswordRow>(
    `
    SELECT id, email, password_hash, role, created_at 
    FROM users WHERE email = $1`,
    [email],
  );

  return result.rows[0] ?? null;
}
