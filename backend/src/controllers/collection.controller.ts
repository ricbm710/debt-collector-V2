import type { Request, Response, NextFunction } from "express";
import { getCollectionList as getCollectionListService } from "../services/collection.service.js";

export async function getCollectionList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const list = await getCollectionListService(req.user.id);

    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
}
