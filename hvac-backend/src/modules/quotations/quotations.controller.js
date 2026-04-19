import { createQuotationService } from "./quotations.service.js";
import { ApiResponse, asyncHandler } from "../../utils/index.js";
import {
  getQuotationsService,
  getQuotationDetailService,
  updateQuotationStatusService,
} from "./quotations.service.js";


export const createQuotation = asyncHandler(async (req, res) => {
  const result = await createQuotationService(req.body, req.user);

  return res
    .status(201)
    .json(new ApiResponse(201, result, "Quotation created successfully"));
}); 

// list
export const getQuotations = asyncHandler(async (req, res) => {
  const data = await getQuotationsService();

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Quotations fetched"));
});

// detail
export const getQuotationById = asyncHandler(async (req, res) => {
  const data = await getQuotationDetailService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Quotation detail"));
});

// update status
export const updateQuotationStatus = asyncHandler(async (req, res) => {
  const updated = await updateQuotationStatusService(
    req.params.id,
    req.body.status,
    req.user,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Status updated"));
});