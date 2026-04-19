import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { user, setUser } = useAuth();

	const handleLogin = async () => {
		try {
			const res = await api.post("/auth/login", { email, password });

			setUser(res.data.data.user);
			navigate("/"); // redirect
		} catch (err) {
			alert(err.response?.data?.message || "Error");
		}
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
				{/* Title */}
				<h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
					HVAC Operations System
				</h2>
				<p className="text-sm text-gray-500 text-center mb-6">
					Login to manage systems & operations
				</p>

				{/* Email Input */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-600 mb-1">
						Email
					</label>
					<input
						type="email"
						placeholder="you@company.com"
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
					/>
				</div>

				{/* Password Input */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-600 mb-1">
						Password
					</label>
					<input
						type="password"
						placeholder="••••••••"
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
					/>
				</div>

				{/* Button */}
				<button
					onClick={handleLogin}
					className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-sm"
				>
					Login
				</button>
			</div>
		</div>
	);
}
