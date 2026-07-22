import pool from "../db/database.js";

export async function getCustomers(userId: number) {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        phone,
        email,
        notes,
        created_at,
        updated_at
      FROM customers
      WHERE user_id = $1
      ORDER BY name;
    `,
    [userId],
  );

  return result.rows;
}
