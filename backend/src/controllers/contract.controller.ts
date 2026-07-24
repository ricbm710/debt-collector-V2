import type { Request, Response, NextFunction } from "express";
import { getContracts as getContractsService } from "../services/contract.service.js";

export async function getContracts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = Number(req.params.customerId);

    const contracts = await getContractsService(customerId, req.user.id);

    return res.status(200).json(contracts);
  } catch (err) {
    next(err);
  }
}
