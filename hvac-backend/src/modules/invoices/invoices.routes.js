import express from "express";
import {
  createInvoice,
  getInvoices,
  updateInvoice,
} from "./invoices.controller.js";
import { createInvoiceSchema, updateInvoiceSchema } from "./invoices.validation.js";
import verifyJWT from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";

const router = express.Router();

// router.post("/", verifyJWT, createInvoice);
// router.get("/", verifyJWT, getInvoices);
// router.patch("/:id", verifyJWT, updateInvoice);

router.post(
  "/",
  verifyJWT,
  validate(createInvoiceSchema), // 🔥 ADD
  allowRoles("finance", "admin"),
  createInvoice
);

router.get(
  "/",
  verifyJWT,
  allowRoles("finance", "admin",), // 🔥 ADD
  getInvoices
);

router.patch(
  "/:id",
  verifyJWT,
  validate(updateInvoiceSchema), // 🔥 ADD
  allowRoles("finance", "admin"),
  updateInvoice
);

export default router;