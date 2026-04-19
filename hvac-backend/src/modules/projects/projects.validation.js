import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    quotationId: z.string().uuid(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    status: z.enum([
      "initiated",
      "assigned",
      "in_progress",
      "on_hold",
      "completed",
    ]).optional(),

    assignedTo: z.string().uuid().optional(),

    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});