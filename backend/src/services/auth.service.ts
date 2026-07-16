import { getPool } from "../db/database.js";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const pool = getPool();

  // Validate required fields
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  // Check if the email is already registered
  const existingUser = await pool.query(
    `
      SELECT id
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered.");
  }

  // Insert the new user
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `,
    [name, email, password], // Temporary! We'll hash it with bcrypt next.
  );

  return result.rows[0];
}
