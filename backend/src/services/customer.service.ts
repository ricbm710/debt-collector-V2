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

export async function updateCustomer(
  customerId: number,
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
      UPDATE customers
      SET
        name = $3,
        phone = $4,
        email = $5,
        notes = $6,
        updated_at = NOW()
      WHERE
        id = $1
        AND user_id = $2
      RETURNING
        id,
        name,
        phone,
        email,
        notes,
        created_at,
        updated_at
    `,
    [customerId, userId, name, phone ?? null, email ?? null, notes ?? null],
  );

  if (result.rows.length === 0) {
    throw new AppError("Customer not found.", 404);
  }

  return result.rows[0];
}

export async function deleteCustomer(customerId: number, userId: number) {
  const result = await pool.query(
    `
      DELETE FROM customers
      WHERE
        id = $1
        AND user_id = $2
      RETURNING id;
    `,
    [customerId, userId],
  );

  if (result.rows.length === 0) {
    throw new AppError("Customer not found.", 404);
  }
}

export async function getCustomerSummary(customerId: number, userId: number) {
  //
  // Query 1 - Customer + Financial Summary
  //
  const summaryResult = await pool.query(
    `
      SELECT
        cu.id,
        cu.name,
        cu.phone,
        cu.email,

        COALESCE(
          SUM(ch.amount - ch.paid_amount),
          0
        ) AS outstanding_balance,

        COUNT(*) FILTER (
          WHERE ch.status = 'OVERDUE'
        ) AS overdue_charges,

        COUNT(*) FILTER (
          WHERE ch.status = 'PENDING'
        ) AS pending_charges,

        COUNT(*) FILTER (
          WHERE ch.status = 'PAID'
        ) AS paid_charges

      FROM customers cu

      LEFT JOIN contracts c
        ON c.customer_id = cu.id

      LEFT JOIN charges ch
        ON ch.contract_id = c.id

      WHERE
        cu.id = $1
        AND cu.user_id = $2

      GROUP BY
        cu.id,
        cu.name,
        cu.phone,
        cu.email;
    `,
    [customerId, userId],
  );

  if (summaryResult.rows.length === 0) {
    throw new AppError("Customer not found.", 404);
  }

  //
  // Query 2 - Charge History
  //
  const chargesResult = await pool.query(
    `
      SELECT
        ch.id,
        c.name AS contract_name,
        ch.amount,
        ch.paid_amount,
        ch.status,
        ch.due_date

      FROM charges ch

      INNER JOIN contracts c
        ON c.id = ch.contract_id

      INNER JOIN customers cu
        ON cu.id = c.customer_id

      WHERE
        cu.id = $1
        AND cu.user_id = $2

      ORDER BY
        ch.due_date DESC;
    `,
    [customerId, userId],
  );

  const summary = summaryResult.rows[0];

  return {
    customer: {
      id: summary.id,
      name: summary.name,
      phone: summary.phone,
      email: summary.email,
    },

    summary: {
      outstandingBalance: Number(summary.outstanding_balance),
      overdueCharges: Number(summary.overdue_charges),
      pendingCharges: Number(summary.pending_charges),
      paidCharges: Number(summary.paid_charges),
    },

    charges: chargesResult.rows.map((charge) => ({
      id: charge.id,
      contractName: charge.contract_name,
      amount: Number(charge.amount),
      paidAmount: Number(charge.paid_amount),
      status: charge.status,
      dueDate: charge.due_date,
    })),
  };
}
