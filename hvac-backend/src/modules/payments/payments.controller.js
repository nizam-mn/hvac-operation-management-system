import {
  createPaymentService,
  getPaymentsService,
  updatePaymentService,
} from "./payments.service.js";

import { ApiResponse, asyncHandler } from "../../utils/index.js";

// ➕ Add payment
export const createPayment = asyncHandler(async (req, res) => {
  const payment = await createPaymentService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment added"));
});

// 📥 Get payments by invoice
export const getPayments = asyncHandler(async (req, res) => {
  const payments = await getPaymentsService(req.params.invoiceId);

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "Payments fetched"));
});

// ✏️ Update payment
export const updatePayment = asyncHandler(async (req, res) => {
  const updated = await updatePaymentService(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Payment updated"));
});