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

export async function createCustomer(
  userId: number,
  name: string,
  phone?: string,
  email?: string,
  notes?: string,
) {
  if (!name) {
    throw new AppError("Customer name is required.", 400);
  }

  const result = await pool.query(
    `
      INSERT INTO customers (
        user_id,
        name,
        phone,
        email,
        notes
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        phone,
        email,
        notes,
        created_at,
        updated_at
    `,
    [userId, name, phone ?? null, email ?? null, notes ?? null],
  );

  return result.rows[0];
}
