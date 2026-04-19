import {
  createLeadService,
  getLeadsService,
  updateLeadService,
} from "./leads.service.js";

import { ApiResponse, asyncHandler } from "../../utils/index.js";

export const createLead = asyncHandler(async (req, res) => {
  const lead = await createLeadService(req.body, req.user);

  return res
    .status(201)
    .json(new ApiResponse(201, lead, "Lead created successfully"));
});
 

export const getLeads = asyncHandler(async (req, res) => {
  const leads = await getLeadsService(req.user, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, leads, "Leads fetched successfully"));
});

export const updateLead = asyncHandler(async (req, res) => {
  const updated = await updateLeadService(req.params.id, req.body, req.user);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Lead updated successfully"));
});