import {
  createInvoiceService,
  getInvoicesService,
  updateInvoiceService,
} from "./invoices.service.js";

import { ApiResponse, asyncHandler } from "../../utils/index.js";

// create
export const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await createInvoiceService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, invoice, "Invoice created"));
});

// list
export const getInvoices = asyncHandler(async (req, res) => {
  const data = await getInvoicesService();

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Invoices fetched"));
});

// update status
export const updateInvoice = asyncHandler(async (req, res) => {
  const updated = await updateInvoiceService(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Invoice updated"));
});