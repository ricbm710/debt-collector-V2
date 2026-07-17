import { Router } from "express";
import { me } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticateToken, me);

export default router;
