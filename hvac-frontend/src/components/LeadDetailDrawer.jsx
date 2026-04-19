import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LeadDetailsDrawer({ lead, onClose, onStatusChange }) {
	const [status, setStatus] = useState(lead?.status || "");
	const navigate = useNavigate();
	const { user } = useAuth();

	if (!lead) return null;

	const handleStatusChange = async (value) => {
		setStatus(value);
		await api.put(`/leads/${lead.id}`, { status: value });
		onStatusChange?.(lead.id, value);
	};

	return (
		<div className="fixed inset-0 z-50 flex">
			{/* Overlay */}
			<div onClick={onClose} className="flex-1 bg-black/40 backdrop-blur-sm" />

			{/* Drawer */}
			<div className="w-full max-w-md bg-white shadow-xl h-full p-6 overflow-y-auto animate-slide-in">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-semibold text-gray-800">Lead Details</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-lg"
					>
						<X size={18} color="red" />
					</button>
				</div>

				{/* Title */}
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					{lead.title}
				</h2>

				{/* Status + Actions */}
				<div className="flex items-center gap-2 mb-6">
					<select
						value={status}
						onChange={(e) => handleStatusChange(e.target.value)}
						className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
					>
						<option value="new">New</option>
						<option value="contacted">Contacted</option>
						<option value="qualified">Qualified</option>
						<option value="quoted">Quoted</option>
						<option value="won">Won</option>
						<option value="lost">Lost</option>
					</select>

					{/* <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						Edit
					</button> */}
				</div>

				{/* Info Section */}
				<div className="space-y-3 text-sm">
					<div>
						<p className="text-gray-500">Client</p>
						<p className="font-medium text-gray-800">{lead.clientName}</p>
					</div>

					<div>
						<p className="text-gray-500">Phone</p>
						<a href={`tel:${lead.phone}`} className="text-blue-600 font-medium">
							{lead.phone || "N/A"}
						</a>
					</div>

					<div>
						<p className="text-gray-500">Email</p>
						<a
							href={`mailto:${lead.email}`}
							className="text-blue-600 font-medium"
						>
							{lead.email || "N/A"}
						</a>
					</div>

					<div>
						<p className="text-gray-500">Source</p>
						<p className="text-gray-800">{lead.source}</p>
					</div>

					<div>
						<p className="text-gray-500">Estimated Value</p>
						<p className="text-gray-800 font-semibold">
							₹{lead.estimatedValue}
						</p>
					</div>

					<div>
						<p className="text-gray-500">Site Visit</p>
						<p className="text-gray-800">
							{lead.siteVisitDate
								? new Date(lead.siteVisitDate).toLocaleDateString()
								: "N/A"}
						</p>
					</div>

					{/* Notes */}
					<div>
						<p className="text-gray-500">Notes</p>
						<p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
							{lead.notes || "No notes added"}
						</p>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="mt-8 flex gap-3">
					<a
						href={`tel:${lead.phone}`}
						className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
					>
						Call
					</a>

					<a
						href={`mailto:${lead.email}`}
						className="flex-1 text-center bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
					>
						Email
					</a>
				</div>
				{["sales", "admin"].includes(user.role) &&
					lead.status === "site_visited" && (
						<button
							onClick={() => navigate(`/quotations/create/${lead.id}`)}
							className="px-3 py-2 mt-4 w-full cursor-pointer text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							Add Quotation
						</button>
					)}
			</div>
		</div>
	);
}
