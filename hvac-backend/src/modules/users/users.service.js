import { getUsers } from "./users.repository.js";

export const getUsersService = async (query) => {
  const { role } = query;

  return getUsers(role);
};