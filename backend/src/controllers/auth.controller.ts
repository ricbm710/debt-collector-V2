import type { Request, Response } from "express";
//services
import { registerUser } from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const result = await registerUser(name, email, password);

  return res.status(201).json(result);
}
