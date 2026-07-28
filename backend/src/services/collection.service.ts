import pool from "../db/database.js";

export async function getCollectionList(userId: number) {
  const result = await pool.query(
    `
      SELECT
        cu.id AS customer_id,
        cu.name AS customer_name,
        cu.phone,

        COUNT(ch.id) AS overdue_charges,

        COALESCE(
          SUM(ch.amount - ch.paid_amount),
          0
        ) AS balance,

        CURRENT_DATE - MIN(ch.due_date) AS days_late

      FROM customers cu

      INNER JOIN contracts c
        ON c.customer_id = cu.id

      INNER JOIN charges ch
        ON ch.contract_id = c.id

      WHERE
        cu.user_id = $1
        AND ch.status = 'OVERDUE'

      GROUP BY
        cu.id,
        cu.name,
        cu.phone

      ORDER BY
        days_late DESC,
        balance DESC;
    `,
    [userId],
  );

  return result.rows;
}
