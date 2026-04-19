import { db } from "../../db/index.js";
import { payments } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const createPayment = async (data) => {
  const [payment] = await db.insert(payments).values(data).returning();
  return payment;
};

export const getPaymentsByInvoice = async (invoiceId) => {
  return db
    .select()
    .from(payments)
    .where(eq(payments.invoiceId, invoiceId));
};

export const updatePayment = async (id, data) => {
  const [updated] = await db
    .update(payments)
    .set(data)
    .where(eq(payments.id, id))
    .returning();

  return updated;
};

export const deletePayment = async (id) => {
  const [deleted] = await db
    .delete(payments)
    .where(eq(payments.id, id))
    .returning();

  return deleted;
};