import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import QuoteDetailsDrawer from "../../components/QuoteDetailDrawer";
import QuotationsItem from "../../components/QuotationItem";

const STATUS_OPTIONS = [
	{ label: "Draft", value: "draft" },
	{ label: "Submitted", value: "submitted" },
	{ label: "Negotiation", value: "negotiation" },
	{ label: "Approved", value: "approved" },
	{ label: "Rejected", value: "rejected" },
	{ label: "Won", value: "won" },
	{ label: "Lost", value: "lost" },
];
 
export default function QuotationsPage() {
	const [quotations, setQuotations] = useState([]);
	const { user } = useAuth();
	const [selectedQuotation, setSelectedQuotation] = useState(null);

	const fetchQuotations = async () => {
		const res = await api.get("/quotations");
		setQuotations(res.data.data);
	};

	useEffect(() => {
		fetchQuotations();
	}, []);

	const handleView = async (id) => {
		try {
			const res = await api.get(`/quotations/${id}`);

			// 🔥 this already includes items
			setSelectedQuotation(res.data.data);
		} catch (err) {
			alert("Failed to fetch quotation");
		}
	};

	const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/quotations/${id}/status`, { status });
            fetchQuotations();
        } catch (err) {
            alert("Failed to update status");
            console.log(err.response?.data);
        }
		// await api.patch(`/quotations/${id}/status`, { status });
		// fetchQuotations();
	};

	const handleCreateProject = async (quotationId) => {
		await api.post("/projects", { quotationId });
		alert("Project created!");
	};

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

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Quotations Dashboard
			</h2>

			<div className="grid gap-4 ">
				{quotations.map((q) => (
                    <QuotationsItem q={q} handleStatusUpdate={handleStatusUpdate} handleCreateProject={handleCreateProject} handleView={handleView} />
				))}
			</div>
			{selectedQuotation && (
				<QuoteDetailsDrawer
					quotation={selectedQuotation}
					onClose={() => setSelectedQuotation(null)}
					// onStatusChange={onStatusChange}
				/>
			)}
		</div>
	);
}
