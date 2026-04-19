import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "../utils/index.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

/**
 * Authentication Middleware to protect routes
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, decodedToken.id),
        });

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export default verifyJWT;