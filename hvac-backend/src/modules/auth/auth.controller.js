import { registerService, loginService } from "./auth.service.js";

import { ApiResponse, asyncHandler } from "../../utils/index.js";

export const register = asyncHandler(async (req, res) => {
	const user = await registerService(req.body);

	return res
		.status(201)
		.json(new ApiResponse(201, user, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
	const { user, token } = await loginService(req.body);

	const options = {
		// httpOnly: true,
		// secure: process.env.NODE_ENV === "production",
		// sameSite: "strict",
		httpOnly: true,
		secure: false, // ✅ for localhost
		sameSite: "lax", // 🔥 change from 'strict'
	};

	return res
		.status(200)
		.cookie("accessToken", token, options)
		.json(new ApiResponse(200, { user, token }, "User logged in successfully"));
});

export const logout = asyncHandler(async (req, res) => {
	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
