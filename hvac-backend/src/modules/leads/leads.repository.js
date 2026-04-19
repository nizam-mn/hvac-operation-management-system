import { db } from "../../db/index.js";
import { leads } from "../../db/schema.js";
import { and, eq, ilike } from "drizzle-orm";

export const createLead = async (data) => {
	const [lead] = await db.insert(leads).values(data).returning();
	return lead;
};

export const getLeadsByUser = async (userId) => {
	return db.select().from(leads).where(eq(leads.assignedTo, userId));
};

export const getLeadsWithFilters = async (filters, query) => {
	const { status, search, page = 1, limit = 10 } = query;

	let conditions = [];

	if (filters.assignedTo) {
		conditions.push(eq(leads.assignedTo, filters.assignedTo));
	}

	if (status) {
		conditions.push(eq(leads.status, status));
	}

	if (search) {
		conditions.push(ilike(leads.title, `%${search}%`)); // later to :- ilike(leads.clientName, `%${search}%`)
	}

	const offset = (page - 1) * limit;

	return db
		.select()
		.from(leads)
		// .where(and(...conditions))
        .where(conditions.length ? and(...conditions) : undefined)
		.limit(Number(limit))
		.offset(Number(offset));
};

export const updateLeadById = async (id, data) => {
	const [updated] = await db
		.update(leads)
		.set(data)
		.where(eq(leads.id, id))
		.returning();

	return updated;
};
