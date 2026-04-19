import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../utils/index.js";
import {
	createPayment,
	getPaymentsByInvoice,
	updatePayment,
} from "./payments.repository.js";

import {
	getInvoiceById,
	updateInvoice,
} from "../invoices/invoices.repository.js";

export const createPaymentService = async (data) => {
  const { invoiceId, amount, type } = data;

  if (!invoiceId || !amount) {
    throw new ApiError(400, "Invoice and amount required");
  }

  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const payments = await getPaymentsByInvoice(invoiceId);

  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const remaining = Number(invoice.amount) - totalPaid;

  // 🚨 Prevent overpayment
  if (Number(amount) > remaining) {
    throw new ApiError(400, "Payment exceeds remaining amount");
  }

  // ➕ Create payment
  const payment = await createPayment({
    id: uuidv4(),
    invoiceId,
    amount: String(amount),
    type: type || "partial",
    status: "paid",
    paidAt: new Date(),
  });

  const newTotalPaid = totalPaid + Number(amount);

  let status = "pending";
  let paidAt = null;

  if (newTotalPaid === 0) {
    status = "pending";
  } else if (newTotalPaid < Number(invoice.amount)) {
    status = "partial";
  } else {
    status = "paid";
    paidAt = new Date(); // ✅ only when fully paid
  }

  // 🔥 Update invoice
  await updateInvoice(invoiceId, {
    status,
    totalPaid: String(newTotalPaid),
    paidAt,
  });

  return payment;
};

// 📥 Get payments
export const getPaymentsService = async (invoiceId) => {
	return getPaymentsByInvoice(invoiceId);
};

// ✏️ Update (rarely used)
export const updatePaymentService = async (id, data) => {
	const updated = await updatePayment(id, data);

	if (!updated) {
		throw new ApiError(404, "Payment not found");
	}

	return updated;
};
