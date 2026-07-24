import type { Request, Response, NextFunction } from "express";
import { getCustomers as getCustomersService } from "../services/customer.service.js";
import { getCustomerById as getCustomerByIdService } from "../services/customer.service.js";

export async function getCustomers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customers = await getCustomersService(req.user.id);

    return res.status(200).json(customers);
  } catch (err) {
    next(err);
  }
}

export async function getCustomerById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const customer = await getCustomerByIdService(id, req.user.id);

    return res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
}
