import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  createCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../controllers/customer.controller.js";

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
router.get("/:id", authenticateToken, getCustomerById);
router.post("/", authenticateToken, createCustomer);
router.put("/:id", authenticateToken, updateCustomer);

export default router;
