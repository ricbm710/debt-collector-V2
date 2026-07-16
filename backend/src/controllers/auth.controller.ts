import type { Request, Response } from "express";
//services
import { loginUser, registerUser } from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const result = await registerUser(name, email, password);

  return res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await loginUser(email, password);

  return res.status(200).json(result);
}
