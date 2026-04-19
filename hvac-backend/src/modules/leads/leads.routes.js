import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
} from "./leads.controller.js";

import validate from "../../middleware/validate.middleware.js";
import verifyJWT from "../../middleware/auth.middleware.js";
import {
  createLeadSchema,
  updateLeadSchema,
} from "./leads.validation.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

// router.post("/", verifyJWT, validate(createLeadSchema), createLead);
// router.get("/", verifyJWT, getLeads);
// router.put("/:id", verifyJWT, validate(updateLeadSchema), updateLead);

router.post("/", verifyJWT, validate(createLeadSchema), allowRoles("marketing", "sales", "admin"), createLead);

router.get("/", verifyJWT, allowRoles("marketing", "sales", "admin"), getLeads);

router.put("/:id", verifyJWT, validate(updateLeadSchema), allowRoles("marketing", "sales", "admin"), updateLead);

export default router; 