import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const findUserByEmail = async (email) => {
    return db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, email),
    });
};

export const createUser = async (data) => {
    const [user] = await db
        .insert(users)
        .values(data)
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
        });

    return user;
};