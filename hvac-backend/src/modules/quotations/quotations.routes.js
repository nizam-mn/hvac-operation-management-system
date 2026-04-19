import express from "express";
import { createQuotation } from "./quotations.controller.js";
import verifyJWT from "../../middleware/auth.middleware.js";
import {
  createQuotationSchema,
  updateQuotationSchema,
  updateQuotationStatusSchema,
} from "./quotations.validation.js";
import validate from "../../middleware/validate.middleware.js";
import {
  getQuotations,
  getQuotationById,
  updateQuotationStatus,
} from "./quotations.controller.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

// router.post(
//   "/",
//   verifyJWT,
//   validate(createQuotationSchema),
//   createQuotation
// );

// router.get("/", verifyJWT, getQuotations);
// router.get("/:id", verifyJWT, getQuotationById);
// router.patch("/:id/status", verifyJWT, updateQuotationStatus);

router.post(
  "/",
  verifyJWT,
  validate(createQuotationSchema),
  allowRoles("sales", "admin"),
  createQuotation
);

router.get(
  "/",
  verifyJWT,
  allowRoles("sales", "admin", "marketing", "project", "finance"),
  getQuotations
);

router.get(
  "/:id",
  verifyJWT,
  allowRoles("sales", "admin", "marketing", "project", "finance"),
  getQuotationById
);

router.patch(
  "/:id/status",
  verifyJWT,
//   validate(updateQuotationSchema),
  validate(updateQuotationStatusSchema),
  allowRoles("sales", "admin", "marketing"),
  updateQuotationStatus
);

export default router; 