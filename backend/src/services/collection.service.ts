import pool from "../db/database.js";

export async function getCollectionList(userId: number) {
  const result = await pool.query(
    `
      SELECT
        ch.id AS charge_id,

        cu.id AS customer_id,
        cu.name AS customer_name,
        cu.phone,

        c.id AS contract_id,
        c.name AS contract_name,

        ch.amount,
        ch.due_date,

        CURRENT_DATE - ch.due_date AS days_late,

        ch.status

      FROM charges ch

      INNER JOIN contracts c
        ON c.id = ch.contract_id

      INNER JOIN customers cu
        ON cu.id = c.customer_id

      WHERE
        cu.user_id = $1
        AND ch.status = 'OVERDUE'

      ORDER BY
        days_late DESC,
        ch.amount DESC;
    `,
    [userId],
  );

  return result.rows;
}
