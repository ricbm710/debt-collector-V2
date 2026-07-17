import { getPool } from "../db/database.js";
import { generateToken } from "../utils/jwtHelper.js";
import { passwordHash, passwordMatches } from "../utils/passwordHelper.js";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  // Validate required fields
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  const pool = getPool();

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

  //encrypt the password
  const passwordHashed = await passwordHash(password);

  // Insert the new user
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `,
    [name, email, passwordHashed],
  );

  return result.rows[0];
}

export async function loginUser(email: string, password: string) {
  // Validate required fields
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const pool = getPool();

  // Find the user
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  const user = result.rows[0];

  // User not found
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Compare password
  const matches = await passwordMatches(password, user.password_hash);

  if (!matches) {
    throw new Error("Invalid email or password.");
  }

  // Generate JWT
  const token = generateToken(user.id);

  // Return login result
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
