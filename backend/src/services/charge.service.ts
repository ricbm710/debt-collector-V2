import pool from "../db/database.js";
import { AppError } from "../errors/AppError.js";

export async function getCharges(contractId: number, userId: number) {
  const result = await pool.query(
    `
      SELECT
        ch.id,
        ch.contract_id,
        ch.amount,
        ch.due_date,
        ch.status,
        ch.paid_amount,
        ch.paid_at,
        ch.created_at,
        ch.updated_at
      FROM charges ch
      INNER JOIN contracts c
        ON c.id = ch.contract_id
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        ch.contract_id = $1
        AND cu.user_id = $2
      ORDER BY ch.due_date;
    `,
    [contractId, userId],
  );

  return result.rows;
}

export async function createCharge(
  contractId: number,
  userId: number,
  amount: number,
  dueDate: string,
) {
  if (!amount || amount <= 0) {
    throw new AppError("A valid amount is required.", 400);
  }

  if (!dueDate) {
    throw new AppError("Due date is required.", 400);
  }

  //
  // Verify ownership of the contract
  //
  const contract = await pool.query(
    `
      SELECT c.id
      FROM contracts c
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        c.id = $1
        AND cu.user_id = $2
    `,
    [contractId, userId],
  );

  if (contract.rows.length === 0) {
    throw new AppError("Contract not found.", 404);
  }

  //
  // Create charge
  //
  const result = await pool.query(
    `
    INSERT INTO charges (
      contract_id,
      amount,
      due_date,
      status
    )
    VALUES ($1, $2, $3, 'PENDING')
    RETURNING
      id,
      contract_id,
      amount,
      due_date,
      status,
      paid_amount,
      paid_at,
      created_at,
      updated_at
  `,
    [contractId, amount, dueDate],
  );

  return result.rows[0];
}

export async function getChargeById(chargeId: number, userId: number) {
  const result = await pool.query(
    `
      SELECT
        ch.id,
        ch.contract_id,
        ch.amount,
        ch.due_date,
        ch.status,
        ch.paid_amount,
        ch.paid_at,
        ch.created_at,
        ch.updated_at
      FROM charges ch
      INNER JOIN contracts c
        ON c.id = ch.contract_id
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        ch.id = $1
        AND cu.user_id = $2
    `,
    [chargeId, userId],
  );

  if (result.rows.length === 0) {
    throw new AppError("Charge not found.", 404);
  }

  return result.rows[0];
}

export async function updateCharge(
  chargeId: number,
  userId: number,
  amount: number,
  dueDate: string,
  status: string,
) {
  if (!amount || amount <= 0) {
    throw new AppError("A valid amount is required.", 400);
  }

  if (!dueDate) {
    throw new AppError("Due date is required.", 400);
  }

  if (!status) {
    throw new AppError("Status is required.", 400);
  }

  const result = await pool.query(
    `
      UPDATE charges ch
      SET
        amount = $3,
        due_date = $4,
        status = $5,
        updated_at = NOW()
      FROM contracts c
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE
        ch.id = $1
        AND c.id = ch.contract_id
        AND cu.user_id = $2
      RETURNING
        ch.id,
        ch.contract_id,
        ch.amount,
        ch.due_date,
        ch.status,
        ch.paid_amount,
        ch.paid_at,
        ch.created_at,
        ch.updated_at;
    `,
    [chargeId, userId, amount, dueDate, status],
  );

  if (result.rows.length === 0) {
    throw new AppError("Charge not found.", 404);
  }

  return result.rows[0];
}

export async function deleteCharge(chargeId: number, userId: number) {
  const result = await pool.query(
    `
      DELETE FROM charges ch
      USING contracts c, customers cu
      WHERE
        ch.id = $1
        AND c.id = ch.contract_id
        AND cu.id = c.customer_id
        AND cu.user_id = $2
      RETURNING ch.id;
    `,
    [chargeId, userId],
  );

  if (result.rows.length === 0) {
    throw new AppError("Charge not found.", 404);
  }
}
