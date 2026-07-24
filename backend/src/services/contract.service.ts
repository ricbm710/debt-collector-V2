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
