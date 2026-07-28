import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
//controller
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/", authenticateToken, getDashboard);

export default router;
