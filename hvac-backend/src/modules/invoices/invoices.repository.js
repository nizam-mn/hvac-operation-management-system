import { db } from "../../db/index.js";
import { invoices } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const createInvoice = async (data) => {
  const [invoice] = await db
    .insert(invoices)
    .values(data)
    .returning();

  return invoice;
};

export const getInvoices = async () => {
  return db.select().from(invoices);
};

export const getInvoiceById = async (id) => {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, id));

  return invoice;
};

export const getInvoiceByProjectId = async (projectId) => {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.projectId, projectId));

  return invoice;
};

export const updateInvoice = async (id, data) => {
  const [updated] = await db
    .update(invoices)
    .set(data)
    .where(eq(invoices.id, id))
    .returning();

  return updated;
};