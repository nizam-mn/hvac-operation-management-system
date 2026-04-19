import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../utils/index.js";
import {
	//   createProject,
	getProjects,
	updateProject,
} from "./projects.repository.js";
import { getQuotationById } from "../quotations/quotations.repository.js";
import {
	createProject as createProjectRepo,
	getProjectByQuotationId, // ✅ ADD THIS
	createProjectTasks,
	getTasksByProject,
	updateTaskById,
	shiftTasksPosition,
} from "./projects.repository.js";

export const createProjectFromQuotation = async (quotationId, userId) => {
	const quotation = await getQuotationById(quotationId);

	if (!quotation) {
		throw new ApiError(404, "Quotation not found");
	}

	if (quotation.status !== "approved") {
		throw new ApiError(400, "Only approved quotations can create project");
	}

	// 🔥 NEW CHECK (duplicate prevention)
	const existingProject = await getProjectByQuotationId(quotationId);

	if (existingProject) {
		throw new ApiError(400, "Project already exists for this quotation");
	}

	const project = await createProjectRepo({
		id: uuidv4(),
		quotationId: quotation.id,
		leadId: quotation.leadId,
		name: quotation.title,
		createdBy: userId,
	});

	// 🔥 CREATE DEFAULT TASKS
	await createDefaultTasks(project.id);

	return project;
};

export const getProjectsService = async () => {
	// console.log("Inside service"); // remove this line after testing

	return getProjects();
};

export const updateProjectService = async (id, data) => {
	const allowed = ["initiated", "in_progress", "completed"];

	if (data.status && !allowed.includes(data.status)) {
		throw new ApiError(400, "Invalid status");
	}

	// const updated = await updateProject(id, data);
	const updated = await updateProject(id, {
		...data,
		startDate: data.startDate ? new Date(data.startDate) : null,
		endDate: data.endDate ? new Date(data.endDate) : null,
	});
	if (!updated) {
		throw new ApiError(404, "Project not found"); // ✅ ADD THIS
	}

	return updated;
};


// project tasks
// 🔥 DEFAULT TASKS
const DEFAULT_TASKS = [
  "Site Preparation",
  "Material Procurement",
  "Installation",
  "Testing & Commissioning",
  "Handover",
];

// 🔥 CREATE DEFAULT TASKS
export const createDefaultTasks = async (projectId) => {
  const tasks = DEFAULT_TASKS.map((title, index) => ({
    id: uuidv4(),
    projectId,
    title,
    position: index + 1,
    status: "not_started",
  }));

  await createProjectTasks(tasks);
};

// 🔥 GET TASKS
export const getProjectTasksService = async (projectId) => {
  return getTasksByProject(projectId);
};

// 🔥 UPDATE TASK STATUS
export const updateTaskService = async (id, data) => {
  const allowed = ["not_started", "initiated", "in_progress", "completed"];

  if (data.status && !allowed.includes(data.status)) {
    throw new ApiError(400, "Invalid status");
  }

  return updateTaskById(id, data);
};

// 🔥 ADD TASK WITH POSITION
export const addTaskService = async (projectId, title, position) => {
  if (!title) {
    throw new ApiError(400, "Task title required");
  }

  if (!position) {
    throw new ApiError(400, "Position required");
  }

  // shift existing tasks
  await shiftTasksPosition(projectId, position);

  const [task] = await createProjectTasks([
    {
      id: uuidv4(),
      projectId,
      title,
      position,
      status: "not_started",
    },
  ]);

  return task;
};
