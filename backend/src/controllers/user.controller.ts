import type { Request, Response } from "express";
import { getCurrentUser } from "../services/user.service.js";

export async function me(req: Request, res: Response) {
  const user = await getCurrentUser(req.user.id);

  return res.status(200).json(user);
}
