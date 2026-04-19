import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../utils/index.js";
import { findUserByEmail, createUser } from "./auth.repository.js";

export const registerService = async ({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
        id: uuidv4(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: role || "sales",
    });

    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return user;
};

export const loginService = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};