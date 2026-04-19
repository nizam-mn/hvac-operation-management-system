import { z } from "zod";

export const createInvoiceSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    amount: z.number().min(1, "Amount is required"),
    dueDate: z.string().optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "paid", "overdue"]).optional(),

    amount: z.number().positive(),
  }),
});