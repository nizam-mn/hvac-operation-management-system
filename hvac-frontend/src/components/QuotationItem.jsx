import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = [
	{ label: "Draft", value: "draft" },
	{ label: "Submitted", value: "submitted" },
	{ label: "Negotiation", value: "negotiation" },
	{ label: "Approved", value: "approved" },
	{ label: "Rejected", value: "rejected" },
	{ label: "Won", value: "won" },
	{ label: "Lost", value: "lost" },
];

export default function QuotationsItem({
	q,
	handleStatusUpdate,
	handleCreateProject,
	handleView,
}) {
	const { user } = useAuth();
	const getAllowedStatuses = (role) => {
		if (role === "sales") {
			return ["draft", "submitted", "negotiation", "won", "lost"];
		}

		if (role === "marketing") {
			return ["submitted", "negotiation", "lost"];
		}

		if (role === "admin") {
			return STATUS_OPTIONS.map((s) => s.value);
		}

		return [];
	};

	const allowedStatuses = getAllowedStatuses(user.role);

	const getStatusBadge = (status) => {
		const base = "px-2 py-1 text-xs font-semibold rounded-full inline-block";

		switch (status) {
			case "approved":
				return `${base} bg-green-100 text-green-700`;
			case "rejected":
				return `${base} bg-red-100 text-red-700`;
			case "draft":
				return `${base} bg-yellow-100 text-yellow-700`;
			default:
				return `${base} bg-gray-100 text-gray-700`;
		}
	};

	return (
		<div
			key={q.id}
			className="flex items-center justify-between bg-white shadow-md rounded-xl p-2.5 border hover:shadow-lg transition"
		>
			<p className="text-base font-semibold text-gray-800">{q.title}</p>

			<p className="text-sm text-gray-500">₹{q.totalAmount}</p>
			<p className={getStatusBadge(q.status)}>{q.status}</p>
			<select
				value={q.status}
				onChange={(e) => handleStatusUpdate(q.id, e.target.value)}
				className="text-xs border rounded px-2 py-1"
			>
				{STATUS_OPTIONS.filter((s) => allowedStatuses.includes(s.value))?.map(
					(s) => (
						<option key={s.value} value={s.value}>
							{s.label}
						</option>
					),
				)}
			</select>
			<div className=" flex flex-wrap gap-2">
				{/* ADMIN */}
				{user.role === "admin" && q.status !== "approved" && (
					<>
						<button
							onClick={() => handleStatusUpdate(q.id, "approved")}
							className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
						>
							Approve
						</button>

						<button
							onClick={() => handleStatusUpdate(q.id, "rejected")}
							className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
						>
							Reject
						</button>
					</>
				)}

				{/* SALES */}
				{["sales", "admin"].includes(user.role) && q.status === "approved" && (
					<button
						onClick={() => handleCreateProject(q.id)}
						className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
					>
						Create Project
					</button>
				)}

				<button
					onClick={() => handleView(q.id)}
					className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					View Details
				</button>
			</div>
		</div>
	);
}
