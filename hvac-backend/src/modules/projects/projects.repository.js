import { db } from "../../db/index.js";
import { projectTasks } from "../../db/schema.js";
import { eq, and, gte } from "drizzle-orm";
import { projects } from "../../db/schema.js";

export const createProject = async (data) => {
  const [project] = await db
    .insert(projects)
    .values(data)
    .returning();

  return project;
};

export const getProjects = async () => {
  return db.select().from(projects);
};

export const getProjectByQuotationId = async (quotationId) => {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.quotationId, quotationId));

  return project;
};

export const getProjectById = async (id) => {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id));

  return project;
};

export const updateProject = async (id, data) => {
  const [updated] = await db
    .update(projects)
    .set(data)
    .where(eq(projects.id, id))
    .returning();

  return updated;
};


// project tasks

// create multiple tasks
export const createProjectTasks = async (tasks) => {
  return db.insert(projectTasks).values(tasks);
};

// get tasks ordered
export const getTasksByProject = async (projectId) => {
  return db
    .select()
    .from(projectTasks)
    .where(eq(projectTasks.projectId, projectId))
    .orderBy(projectTasks.position);
};

// update task
export const updateTaskById = async (id, data) => {
  const [updated] = await db
    .update(projectTasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projectTasks.id, id))
    .returning();

  return updated;
};

// shift positions (IMPORTANT)
export const shiftTasksPosition = async (projectId, position) => {
  return db
    .update(projectTasks)
    .set({
      position: db.sql`${projectTasks.position} + 1`,
    })
    .where(
      and(
        eq(projectTasks.projectId, projectId),
        gte(projectTasks.position, position)
      )
    );
};