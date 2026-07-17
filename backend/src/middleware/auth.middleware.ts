import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtHelper.js";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authorization header missing.",
    });
  }

  const [, token] = authorizationHeader.split(" ");

  if (!token) {
    return res.status(401).json({
      message: "Invalid authorization header.",
    });
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
}
