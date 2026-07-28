import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getCollectionList } from "../controllers/collection.controller.js";

const router = Router();

router.get("/", authenticateToken, getCollectionList);

export default router;
