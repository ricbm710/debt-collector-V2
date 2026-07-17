import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface JwtPayload {
  userId: number;
}

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured.");
}

export function generateToken(userId: number): string {
  const payload: JwtPayload = {
    userId,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
