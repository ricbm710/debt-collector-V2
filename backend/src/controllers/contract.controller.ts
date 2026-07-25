import type { Request, Response, NextFunction } from "express";
//services
import { getContracts as getContractsService } from "../services/contract.service.js";
import { createContract as createContractService } from "../services/contract.service.js";
import { getContractById as getContractByIdService } from "../services/contract.service.js";
import { updateContract as updateContractService } from "../services/contract.service.js";
import { deleteContract as deleteContractService } from "../services/contract.service.js";

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

export async function createContract(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = Number(req.params.customerId);

    const { type, name, status, start_date, end_date } = req.body;

    const contract = await createContractService(
      customerId,
      req.user.id,
      type,
      name,
      status,
      start_date,
      end_date,
    );

    return res.status(201).json(contract);
  } catch (err) {
    next(err);
  }
}

export async function getContractById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = Number(req.params.customerId);
    const contractId = Number(req.params.contractId);

    const contract = await getContractByIdService(
      contractId,
      customerId,
      req.user.id,
    );

    return res.status(200).json(contract);
  } catch (err) {
    next(err);
  }
}

export async function updateContract(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = Number(req.params.customerId);
    const contractId = Number(req.params.contractId);

    const { type, name, status, start_date, end_date } = req.body;

    const contract = await updateContractService(
      contractId,
      customerId,
      req.user.id,
      type,
      name,
      status,
      start_date,
      end_date,
    );

    return res.status(200).json(contract);
  } catch (err) {
    next(err);
  }
}

export async function deleteContract(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = Number(req.params.customerId);
    const contractId = Number(req.params.contractId);

    await deleteContractService(contractId, customerId, req.user.id);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
