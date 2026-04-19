import { z } from "zod";

export const createQuotationSchema = z.object({
  body: z.object({
    leadId: z.string().uuid(),

    title: z.string().min(3, "Title is required"),

    items: z.array(
      z.object({
        itemName: z.string().min(1, "Item name required"),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
      })
    ).min(1, "At least one item is required"),
  }),
}); 

export const updateQuotationSchema = z.object({
  body: z.object({
    status: z.enum(["draft", "approved", "rejected"]).optional(),

    title: z.string().min(3).optional(),

    items: z
      .array(
        z.object({
          itemName: z.string().min(1),
          quantity: z.number().positive(),
          unitPrice: z.number().positive(),
        })
      )
      .optional(),
  }),
});

export const updateQuotationStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "draft",
      "submitted",
      "negotiation",
      "approved",
      "rejected",
      "won",
      "lost",
    ]),
  }),
});