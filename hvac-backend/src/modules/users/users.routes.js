import express from "express";
import { getUsers } from "./users.controller.js";
import verifyJWT from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyJWT,
  allowRoles("admin", "project", "sales", "finance", "marketing"), // adjust if needed
  getUsers
);

export default router;