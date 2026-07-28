import type { Request, Response, NextFunction } from "express";
import { getDashboard as getDashboardService } from "../services/dashboard.service.js";

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dashboard = await getDashboardService(req.user.id);

    return res.status(200).json(dashboard);
  } catch (err) {
    next(err);
  }
}
