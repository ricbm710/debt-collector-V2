import type { Request, Response, NextFunction } from "express";
import { getCurrentUser } from "../services/user.service.js";

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getCurrentUser(req.user.id);

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
