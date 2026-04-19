import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().uuid(),

    amount: z.number().positive(),

    type: z.enum(["advance", "partial", "final"]).optional(),

    // dueDate: z.string().optional(),
  }),
});