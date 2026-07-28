import type { Request, Response, NextFunction } from "express";
import { getCharges as getChargesService } from "../services/charge.service.js";
import { createCharge as createChargeService } from "../services/charge.service.js";
import { getChargeById as getChargeByIdService } from "../services/charge.service.js";
import { updateCharge as updateChargeService } from "../services/charge.service.js";
import { deleteCharge as deleteChargeService } from "../services/charge.service.js";

export async function getCharges(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const contractId = Number(req.params.contractId);

    const charges = await getChargesService(contractId, req.user.id);

    return res.status(200).json(charges);
  } catch (err) {
    next(err);
  }
}

export async function createCharge(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const contractId = Number(req.params.contractId);

    const { amount, due_date, status } = req.body;

    const charge = await createChargeService(
      contractId,
      req.user.id,
      amount,
      due_date,
    );

    return res.status(201).json(charge);
  } catch (err) {
    next(err);
  }
}

export async function getChargeById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const chargeId = Number(req.params.id);

    const charge = await getChargeByIdService(chargeId, req.user.id);

    return res.status(200).json(charge);
  } catch (err) {
    next(err);
  }
}

export async function updateCharge(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const chargeId = Number(req.params.id);

    const { amount, due_date, status } = req.body;

    const charge = await updateChargeService(
      chargeId,
      req.user.id,
      amount,
      due_date,
      status,
    );

    return res.status(200).json(charge);
  } catch (err) {
    next(err);
  }
}

export async function deleteCharge(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const chargeId = Number(req.params.id);

    await deleteChargeService(chargeId, req.user.id);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
