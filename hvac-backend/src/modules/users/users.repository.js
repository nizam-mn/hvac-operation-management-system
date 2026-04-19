import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const getUsers = async (role) => {
  if (role) {
    return db.select().from(users).where(eq(users.role, role));
  }

  return db.select().from(users);
};