import pool from "../db/database.js";
import { AppError } from "../errors/AppError.js";

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

export async function getCustomerById(customerId: number, userId: number) {
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
    WHERE id = $1
      AND user_id = $2
    `,
    [customerId, userId],
  );

  if (result.rows.length === 0) {
    throw new AppError("Customer not found.", 404);
  }

  return result.rows[0];
}
