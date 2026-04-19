import { createProjectFromQuotation, getProjectsService, updateProjectService, getProjectTasksService, updateTaskService, addTaskService } from "./projects.service.js";
import { ApiResponse, asyncHandler } from "../../utils/index.js";

export const createProject = asyncHandler(async (req, res) => {
	const project = await createProjectFromQuotation(req.body.quotationId, req.user.id);

	return res
		.status(201)
		.json(new ApiResponse(201, project, "Project created successfully"));
});

export const getProjects = asyncHandler(async (req, res) => {
	// console.log("Fetching projects..."); //r remove this line after testing

	const data = await getProjectsService();
	// console.log("Projects:", data); // remove this line after testing
	return res.status(200).json(new ApiResponse(200, data, "Projects fetched"));
});

export const updateProject = asyncHandler(async (req, res) => {
	const updated = await updateProjectService(req.params.id, req.body);

	return res.status(200).json(new ApiResponse(200, updated, "Project updated"));
});


// project tasks

// get tasks
export const getProjectTasks = asyncHandler(async (req, res) => {
  const tasks = await getProjectTasksService(req.params.projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched"));
});

// update task
export const updateTask = asyncHandler(async (req, res) => {
  const updated = await updateTaskService(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Task updated"));
});

// add task
export const addTask = asyncHandler(async (req, res) => {
  const { title, position } = req.body;

  const task = await addTaskService(
    req.params.projectId,
    title,
    position
  );

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task added"));
});