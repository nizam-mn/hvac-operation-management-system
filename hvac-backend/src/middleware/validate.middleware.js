import { ApiError } from "../utils/index.js";

/**
 * Generic Validation Middleware using Zod
 */
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        const errorMessages = err.errors.map((item) => ({
            path: item.path.join("."),
            message: item.message,
        }));
        next(new ApiError(400, "Validation Error", errorMessages));
    }
};

export default validate;
