import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured.");
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}
