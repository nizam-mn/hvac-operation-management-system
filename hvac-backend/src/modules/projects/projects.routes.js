import express from "express";
import {
    addTask,
	createProject,
	getProjects,
	getProjectTasks,
	updateProject,
    updateTask,
} from "./projects.controller.js";
import verifyJWT from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { updateProjectSchema } from "./projects.validation.js";
import validate from "../../middleware/validate.middleware.js";

const router = express.Router();

// router.post("/", verifyJWT, createProject);
// router.get("/", verifyJWT, getProjects);
// router.patch("/:id", verifyJWT, updateProject);

router.post(
  "/",
  verifyJWT,
  allowRoles("sales", "admin"), // 🔥 ADD
  createProject
);

router.get(
  "/",
  verifyJWT,
  allowRoles("project", "admin", "finance"), // 🔥 ADD
  getProjects
);

router.patch(
  "/:id",
  verifyJWT,
  validate(updateProjectSchema), // 🔥 ADD
  allowRoles("project", "admin"),
  updateProject
);

// project tasks

// get tasks
router.get(
  "/:projectId/tasks",
  verifyJWT,
  allowRoles("project", "admin", "sales"),
  getProjectTasks
);

// update task
router.patch(
  "/tasks/:id",
  verifyJWT,
  allowRoles("project", "admin"),
  updateTask
);

// add task
router.post(
  "/:projectId/tasks",
  verifyJWT,
  allowRoles("project", "admin"),
  addTask
);

export default router;


