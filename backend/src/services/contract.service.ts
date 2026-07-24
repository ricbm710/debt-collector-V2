import pool from "../db/database.js";
import { AppError } from "../errors/AppError.js";

export async function getContracts(customerId: number, userId: number) {
  const result = await pool.query(
    `
      SELECT
        c.id,
        c.customer_id,
        c.type,
        c.name,
        c.status,
        c.start_date,
        c.end_date,
        c.created_at,
        c.updated_at
      FROM contracts c
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        c.customer_id = $1
        AND cu.user_id = $2
      ORDER BY c.name;
    `,
    [customerId, userId],
  );

  return result.rows;
}

export async function createContract(
  customerId: number,
  userId: number,
  type: string,
  name: string,
  status: string,
  startDate: string,
  endDate?: string,
) {
  if (!type || !name || !status || !startDate) {
    throw new AppError("All required fields must be provided.", 400);
  }

  //
  // Verify the customer belongs to the logged-in user
  //
  const customer = await pool.query(
    `
      SELECT id
      FROM customers
      WHERE
        id = $1
        AND user_id = $2
    `,
    [customerId, userId],
  );

  if (customer.rows.length === 0) {
    throw new AppError("Customer not found.", 404);
  }

  //
  // Create contract
  //
  const result = await pool.query(
    `
      INSERT INTO contracts (
        customer_id,
        type,
        name,
        status,
        start_date,
        end_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        customer_id,
        type,
        name,
        status,
        start_date,
        end_date,
        created_at,
        updated_at
    `,
    [customerId, type, name, status, startDate, endDate ?? null],
  );

  return result.rows[0];
}
