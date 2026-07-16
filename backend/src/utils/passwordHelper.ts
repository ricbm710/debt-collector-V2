import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function passwordHash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function passwordMatches(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
