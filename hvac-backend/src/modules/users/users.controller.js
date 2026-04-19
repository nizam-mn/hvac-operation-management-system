import { getUsersService } from "./users.service.js";
import { ApiResponse, asyncHandler } from "../../utils/index.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getUsersService(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched"));
});