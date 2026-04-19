import { db } from "../../db/index.js";
import { quotations, quotationItems } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const createQuotation = async (data) => {
  const [q] = await db.insert(quotations).values(data).returning();
  return q;
};

export const createQuotationItems = async (items) => {
  return db.insert(quotationItems).values(items);
};

export const getQuotationByLead = async (leadId) => {
  return db
    .select()
    .from(quotations)
    .where(eq(quotations.leadId, leadId));
}; 

// get all quotations
export const getQuotations = async () => {
  return db.select().from(quotations);
};

// get by id
export const getQuotationById = async (id) => {
  const [q] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, id));

  return q;
};

// get items
export const getQuotationItems = async (quotationId) => {
  return db
    .select()
    .from(quotationItems)
    .where(eq(quotationItems.quotationId, quotationId));
};

// update status
export const updateQuotationStatus = async (id, status) => {
  const [updated] = await db
    .update(quotations)
    .set({ status, updatedAt: new Date() })
    .where(eq(quotations.id, id))
    .returning();

  return updated;
};