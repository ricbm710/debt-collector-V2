import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// router.get("/", authenticateToken, getContracts);
// router.get("/:id", authenticateToken, getContractById);
// router.post("/", authenticateToken, createContract);
// router.put("/:id", authenticateToken, updateContract);
// router.delete("/:id", authenticateToken, deleteContract);

export default router;
