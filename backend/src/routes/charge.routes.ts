import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  deleteCharge,
  getChargeById,
  updateCharge,
} from "../controllers/charge.controller.js";
//controller

const router = Router();

//check
// router.get(
//   "/",
//   authenticateToken,
//   (req, res, next) => {
//     console.log("✅ GET /charges route reached");
//     next();
//   },
//   getCharges,
// );

router.get("/:id", authenticateToken, getChargeById);
router.put("/:id", authenticateToken, updateCharge);
router.delete("/:id", authenticateToken, deleteCharge);

export default router;
