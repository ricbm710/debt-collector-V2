import pool from "../db/database.js";

export async function getDashboard(userId: number) {
  //
  // Customers
  //
  const customersResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM customers
      WHERE user_id = $1;
    `,
    [userId],
  );

  //
  // Contracts
  //
  const contractsResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM contracts c
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE cu.user_id = $1;
    `,
    [userId],
  );

  //
  // Pending Charges
  //
  const pendingChargesResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM charges ch
      INNER JOIN contracts c
        ON c.id = ch.contract_id
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        cu.user_id = $1
        AND ch.status = 'PENDING';
    `,
    [userId],
  );

  //
  // Overdue Charges
  //
  const overdueChargesResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM charges ch
      INNER JOIN contracts c
        ON c.id = ch.contract_id
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        cu.user_id = $1
        AND ch.status = 'PENDING'
        AND ch.due_date < CURRENT_DATE;
    `,
    [userId],
  );

  //
  // Outstanding Balance
  //
  const balanceResult = await pool.query(
    `
      SELECT
        COALESCE(SUM(amount - paid_amount), 0) AS total
      FROM charges ch
      INNER JOIN contracts c
        ON c.id = ch.contract_id
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        cu.user_id = $1
        AND ch.status <> 'CANCELLED';
    `,
    [userId],
  );

  return {
    customers: Number(customersResult.rows[0].total),
    contracts: Number(contractsResult.rows[0].total),
    pendingCharges: Number(pendingChargesResult.rows[0].total),
    overdueCharges: Number(overdueChargesResult.rows[0].total),
    outstandingBalance: Number(balanceResult.rows[0].total),
  };
}
