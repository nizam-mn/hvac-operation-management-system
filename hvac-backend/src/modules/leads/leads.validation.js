

import { z } from "zod";

export const createLeadSchema = z.object({
	body: z.object({
		title: z.string().min(2),
		clientName: z.string().min(2),

		phone: z.string().optional(),
		email: z.string().email().optional(),

		source: z.string().optional(),
		estimatedValue: z.string().optional(),

		assignedTo: z.string().optional(),
		siteVisitDate: z.string().optional(),

		notes: z.string().optional(),
	}),
});

export const updateLeadSchema = z.object({
	body: z.object({
		status: z
			.enum([
				"new",
				"contacted",
				"qualified",
				"site_visit_required",
				"site_visited",
				"quoted",
				"won",
				"lost",
			])
			.optional(),

		title: z.string().optional(),
		clientName: z.string().optional(),
		notes: z.string().optional(),
	}),
});
