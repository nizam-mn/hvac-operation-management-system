import express from "express";
import {
  createPayment,
  getPayments,
  updatePayment,
} from "./payments.controller.js";

import verifyJWT from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

// ➕ Add payment
router.post(
  "/",
  verifyJWT,
  allowRoles("finance", "admin"),
  createPayment
);

// 📥 Get by invoice
router.get(
  "/:invoiceId",
  verifyJWT,
  allowRoles("finance", "admin", "project"),
  getPayments
);

// ✏️ Update (optional)
router.patch(
  "/:id",
  verifyJWT,
  allowRoles("finance", "admin"),
  updatePayment
);

export default router;