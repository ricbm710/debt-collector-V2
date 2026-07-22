import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getCustomers } from "../controllers/customer.controller.js";

const router = Router();

//check
// router.get(
//   "/",
//   authenticateToken,
//   (req, res, next) => {
//     console.log("✅ GET /customers route reached");
//     next();
//   },
//   getCustomers,
// );

router.get("/", authenticateToken, getCustomers);

export default router;
