import type { Request, Response, NextFunction } from "express";
//services
import { getCustomers as getCustomersService } from "../services/customer.service.js";
import { getCustomerById as getCustomerByIdService } from "../services/customer.service.js";
import { createCustomer as createCustomerService } from "../services/customer.service.js";
import { updateCustomer as updateCustomerService } from "../services/customer.service.js";
import { deleteCustomer as deleteCustomerService } from "../services/customer.service.js";

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

export async function createCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, phone, email, notes } = req.body;

    const customer = await createCustomerService(
      req.user.id,
      name,
      phone,
      email,
      notes,
    );

    return res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
}

export async function updateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = Number(req.params.id);
    const { name, phone, email, notes } = req.body;

    const customer = await updateCustomerService(
      customerId,
      req.user.id,
      name,
      phone,
      email,
      notes,
    );

    return res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
}

export async function deleteCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = Number(req.params.id);

    await deleteCustomerService(customerId, req.user.id);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
