import pool from "../db/database.js";
//errors
import { AppError } from "../errors/AppError.js";

export async function getCurrentUser(userId: number) {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      WHERE id = $1
    `,
    [userId],
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
}
