import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const { user } = useAuth();

	const navigate = useNavigate();

	return (
		<nav className="bg-white border-b z-50 relative border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
			{/* Logo / Brand */}
			<div className="flex items-center gap-2">
				<span className="text-2xl">🍂</span>
				<h2 className="text-xl font-semibold text-gray-800">AutumnWare</h2>
			</div>

            <div className="flex items-center gap-4" >
                <Link to="/leads" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Leads
                </Link>
                <Link to="/quotations" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Quotations
                </Link>
                
                <Link to="/projects" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Projects
                </Link>
                <Link to="/invoices" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Invoices
                </Link>
            </div>

			{/* User Section */}
			{user && (
				<button
					onClick={() => navigate("/profile")}
					className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1.5 transition-colors cursor-pointer"
				>
					{/* Avatar */}
					<div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
						{user.name?.charAt(0).toUpperCase()}
					</div>

					{/* User Info */}
					<div className="text-sm text-gray-700">
						<p className="font-medium">{user.name}</p>
						<p className="text-xs text-gray-500 capitalize">{user.role}</p>
					</div>
				</button>
			)}
		</nav>
	);
}
