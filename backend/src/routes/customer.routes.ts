import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../controllers/customer.controller.js";
import {
  createContract,
  deleteContract,
  getContractById,
  getContracts,
  updateContract,
} from "../controllers/contract.controller.js";

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
router.delete("/:id", authenticateToken, deleteCustomer);

//contract related:

router.get("/:customerId/contracts", authenticateToken, getContracts);
router.post("/:customerId/contracts", authenticateToken, createContract);
router.get(
  "/:customerId/contracts/:contractId",
  authenticateToken,
  getContractById,
);
router.put(
  "/:customerId/contracts/:contractId",
  authenticateToken,
  updateContract,
);
router.delete(
  "/:customerId/contracts/:contractId",
  authenticateToken,
  deleteContract,
);

export default router;
