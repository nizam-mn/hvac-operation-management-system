import { useEffect, useState } from "react";
import api from "../../api/axios";
import InvoiceModal from "./InvoiceModal";
import ProjectList from "../../components/ProjectList";
import ProjectDetailModal from "../../components/ProjectDetailModal";
import { useAuth } from "../../context/AuthContext";
import PaymentsDrawer from "../../components/PaymentDrawer";

export default function InvoicesPage() {
	const [invoices, setInvoices] = useState([]);
	const [projects, setProjects] = useState([]);
	const [selectedProjectForInvoice, setSelectedProjectForInvoice] =
		useState(null);
	const [selectedQuotation, setSelectedQuotation] = useState(null);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const { user } = useAuth();

	const fetchInvoices = async () => {
		try {
			const res = await api.get("/invoices");
			setInvoices(res.data.data);
		} catch (err) {
			console.log(err);
			alert("Failed to fetch invoices");
		}
	};

	const fetchProjects = async () => {
		try {
			const res = await api.get("/projects");
			setProjects(res.data.data);
		} catch (err) {
			console.log(err);
			alert("Failed to fetch projects");
		}
	};

	useEffect(() => {
		fetchInvoices();
		fetchProjects();
	}, []);

	const projectsWithoutInvoice = projects.filter(
		(p) => !invoices.some((i) => i.projectId === p.id),
	);

	const getProjectName = (projectId) => {
		const project = projects.find((p) => p.id === projectId);
		return project?.name || "Unknown Project";
	};


	const handleCreateInvoice = async (amount, dueDate) => {
		try {
			await api.post("/invoices", {
				projectId: selectedProjectForInvoice.id,
				amount: Number(amount),
                dueDate: dueDate
			});

			setSelectedProjectForInvoice(null);
			fetchInvoices();
		} catch (err) {
			console.log(err);
			alert(err.response?.data?.message || "Error");
		}
	};

	const handleMarkPaid = async (id) => {
		try {
			await api.patch(`/invoices/${id}`, { status: "paid" });
			fetchInvoices();
		} catch {
			alert("Failed to update");
		}
	};

	const getStatusBadge = (status) => {
		const base = "px-2 py-1 text-xs font-semibold rounded-full inline-block";

		if (status === "paid") return `${base} bg-green-100 text-green-700`;
		if (status === "pending") return `${base} bg-yellow-100 text-yellow-700`;
		if (status === "overdue") return `${base} bg-red-100 text-red-700`;

		return base;
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h2 className="text-2xl font-bold mb-6">Finance Dashboard</h2>

			{/* 🟩 CREATE INVOICE */}
			<div className="bg-white p-5 rounded-xl shadow mb-6">
				<h3 className="font-semibold mb-4 text-gray-800">Create Invoice</h3>

				{projectsWithoutInvoice.length === 0 ? (
					<p className="text-gray-500 text-sm">All projects already invoiced</p>
				) : (
					<ProjectList
						projectsWithoutInvoice={projectsWithoutInvoice}
						setSelectedProjectForInvoice={setSelectedProjectForInvoice}
					/>
				)}
			</div>

			{/* 🟪 INVOICE LIST */}
			<div className="bg-white p-5 rounded-xl shadow">
				<h3 className="font-semibold mb-4 text-gray-800">Invoices</h3>

				{invoices.length === 0 ? (
					<p className="text-gray-500 text-sm">No invoices created yet</p>
				) : (
					<div className="grid gap-3">
						{invoices.map((inv) => {
							const total = Number(inv.amount);
							const paid = Number(inv.totalPaid || 0);
							const remaining = total - paid;

							const percent = Math.min((paid / total) * 100, 100);

							const isOverdue =
								inv.dueDate &&
								new Date(inv.dueDate) < new Date() &&
								inv.status !== "paid";

							return (
								<div
									key={inv.id}
									className={`flex flex-col gap-2 border p-4 rounded-xl transition hover:shadow-md
              ${isOverdue ? "border-red-500 bg-red-50" : "bg-white"}
            `}
								>
									{/* HEADER */}
									<div className="flex justify-between items-center">
										<p className="font-medium text-gray-800">
											{getProjectName(inv.projectId)}
										</p>

										<span className={getStatusBadge(inv.status)}>
											{inv.status}
										</span>
									</div>

									{/* PAYMENT SUMMARY */}
									<div className="text-sm">
										<p className="text-green-600">Paid: ₹{paid}</p>

										<p className="text-red-500">Remaining: ₹{remaining}</p>

										<p className="text-gray-500">Total: ₹{total}</p>
									</div>

									{/* PROGRESS BAR */}
									<div className="w-full bg-gray-200 h-2 rounded-full">
										<div
											className={`h-2 rounded-full ${
												isOverdue ? "bg-red-500" : "bg-blue-600"
											}`}
											style={{ width: `${percent}%` }}
										/>
									</div>

									{/* DUE DATE */}
									{inv.dueDate && (
										<p className="text-xs text-gray-500">
											Due: {new Date(inv.dueDate).toLocaleDateString()}
										</p>
									)}

									{/* OVERDUE LABEL */}
									{isOverdue && (
										<p className="text-xs text-red-600 font-semibold">
											⚠ Overdue
										</p>
									)}

									{/* ACTION */}
									<div className="flex justify-end">
										<button
											onClick={() => setSelectedInvoice(inv)}
											className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
										>
											View Payments
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* 🟨 MODAL */}
			{selectedProjectForInvoice && (
				<InvoiceModal
					project={selectedProjectForInvoice}
					onClose={() => setSelectedProjectForInvoice(null)}
					onSubmit={handleCreateInvoice}
				/>
			)}

			{selectedInvoice && (
				<PaymentsDrawer
					invoice={selectedInvoice}
					onClose={() => setSelectedInvoice(null)}
				/>
			)}

			{["project", "admin", "finance"].includes(user.role) &&
				selectedQuotation && (
					<ProjectDetailModal
						project={selectedQuotation.project}
						quotation={selectedQuotation.quotation}
						quoteItem={selectedQuotation.items}
						onClose={() => setSelectedQuotation(null)}
						onSuccess={fetchProjects}
					/>
				)}
		</div>
	);
}
