import { useEffect, useState } from "react";
import api from "../api/axios";
import LeadForm from "../modules/leads/LeadForm";
import { Plus } from "lucide-react";
import LeadItem from "./LeadItem";

const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit Required", value: "site_visit_required" },
  { label: "Site Visited", value: "site_visited" },
  { label: "Quoted", value: "quoted" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

export default function LeadsList({ showForm, setShowForm }) {
	const [leads, setLeads] = useState([]);
	// const [showForm, setShowForm] = useState(false);

	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");

	const fetchLeads = async () => {
		const res = await api.get("/leads", {
			params: { search, status },
		});
		setLeads(res.data.data);
	};

	// const handleStatusChange = async (leadId, newStatus) => {
	// 	try {
	// 		await api.put(`/leads/${leadId}`, {
	// 			status: newStatus,
	// 		});

	// 		fetchLeads(); // refresh list
	// 	} catch (error) {
	// 		console.error("Failed to update status", error);
	// 	}
	// };

	const handleStatusChange = async (leadId, newStatus) => {
		try {
			await api.put(`/leads/${leadId}`, {
				status: newStatus,
			});

			setLeads((prev) =>
				prev.map((lead) =>
					lead.id === leadId ? { ...lead, status: newStatus } : lead,
				),
			);
		} catch (error) {
			console.error("Failed to update status", error);
		}
	};

	useEffect(() => {
		fetchLeads();
	}, [search, status]);

	return (
        <>
		<div className="min-h-screen bg-gray-100 p-6">

			{/* Leads List */}
			<div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
				{/* Search */}
				<input
					placeholder="Search leads..."
					onChange={(e) => setSearch(e.target.value)}
					className="w-full md:w-1/3 px-4 py-2 bg-gray-300 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
				/>

				{/* Status Filter */}
				<select
					onChange={(e) => setStatus(e.target.value)}
					className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
				>  
					{STATUS_OPTIONS.map((status) => (
						<option key={status.value} value={status.value}>
							{status.label}
						</option>
					))}
				</select>
			</div>

			<div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
				<table className="min-w-full text-sm text-left">
					{/* Header */}
					<thead className="bg-gray-50 border-b">
						<tr className="text-gray-600 uppercase text-xs">
							<th className="px-4 py-3">Project</th>
							<th className="px-4 py-3">Client</th>
							<th className="px-4 py-3">Source</th>
							<th className="px-4 py-3">Value</th>
							<th className="px-4 py-3">Assigned To</th>
							<th className="px-4 py-3">Visit Date</th>
							<th className="px-4 py-3">Status</th>
							<th className="px-4 py-3">Update</th>
						</tr>
					</thead>

					{/* Body */}
					<tbody className="divide-y">
						{leads.map((lead) => (
							<LeadItem
								key={lead.id}
								lead={lead}
								onStatusChange={handleStatusChange}
							/>
						))}
					</tbody>
				</table>

				{/* Empty State */}
				{leads.length === 0 && (
					<p className="text-center text-gray-500 py-6">No leads found</p>
				)}
			</div>
		</div>

        {/* Form Card */}
			{showForm && (
				<div
					onClick={() => setShowForm(false)}
					className="absolute inset-0 z-50 bg-black/60 p-6 grid place-items-center"
				>
					<div onClick={(e) => e.stopPropagation()}>
						<LeadForm
							onSuccess={fetchLeads}
							onClose={() => setShowForm(false)}
						/>
					</div>
				</div>
			)}

            </>
	);
}
