import pool from "../db/database.js";

export async function getDashboard(userId: number) {
  const result = await pool.query(
    `
      WITH customer_balance AS (
        SELECT
          cu.id,
          COALESCE(SUM(ch.amount - ch.paid_amount), 0) AS balance
        FROM customers cu

        LEFT JOIN contracts c
          ON c.customer_id = cu.id

        LEFT JOIN charges ch
          ON ch.contract_id = c.id

        WHERE cu.user_id = $1

        GROUP BY cu.id
      )

      SELECT
        COUNT(*) AS total_customers,

        COUNT(*) FILTER (
          WHERE balance = 0
        ) AS customers_up_to_date,

        COUNT(*) FILTER (
          WHERE balance > 0
        ) AS customers_with_debt,

        COALESCE(SUM(balance), 0) AS outstanding_balance

      FROM customer_balance;
    `,
    [userId],
  );

  return {
    totalCustomers: Number(result.rows[0].total_customers),
    customersUpToDate: Number(result.rows[0].customers_up_to_date),
    customersWithDebt: Number(result.rows[0].customers_with_debt),
    outstandingBalance: Number(result.rows[0].outstanding_balance),
  };
}
