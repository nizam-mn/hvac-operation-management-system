import { CircleChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
// import LeadDetailsModal from "./LeadDetailModal";
import LeadDetailsDrawer from "./LeadDetailDrawer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_OPTIONS = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit Required", value: "site_visit_required" },
  { label: "Site Visited", value: "site_visited" },
  { label: "Quoted", value: "quoted" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
]; 

const getAllowedStatuses = (role) => {
	if (role === "marketing") {
		return ["new", "contacted", "qualified", "site_visit_required"];
	}

	if (role === "sales") {
		return ["site_visit_required", "site_visited", "quoted", "won", "lost"];
	}

	if (role === "admin") {
		return STATUS_OPTIONS.map((s) => s.value);
	}

	return [];
};

export default function LeadItem({ lead, onStatusChange }) {
	const { user } = useAuth();

	const [selectedLead, setSelectedLead] = useState(null);
	const allowedStatuses = getAllowedStatuses(user.role);
    const [users, setUsers] = useState([]);

    useEffect(() => {
            const fetchUsers = async () => {
                const res = await api.get("/users");
                setUsers(res.data.data);
            };
    
            fetchUsers();
        }, []);
    
        const getAssignedToName = (id) => {
            const user = users.find((u) => u.id === id);
            return user?.name || "Unassigned";
        };

	return (
		<>
			<tr className="hover:bg-gray-50 transition justify-between">
				{/* Project */}
				<td className="p-3 font-medium text-gray-800">{lead.title}</td>

				{/* Client */}
				<td className="p-3 text-gray-600">{lead.clientName}</td>

				{/* Source */}
				<td className="p-3 text-gray-600">{lead.source}</td>

				{/* Value */}
				<td className="p-3 text-gray-700 font-medium">
					₹{lead.estimatedValue}
				</td>
				<td className="p-3 text-gray-700 font-medium">
					{getAssignedToName(lead.assignedTo)}
				</td>

				{/* Visit Date */}
				<td className="p-3 text-gray-500">
					{lead.siteVisitDate
						? new Date(lead.siteVisitDate).toLocaleDateString()
						: "N/A"}
				</td>

				{/* Status Badge */}
				<td className="p-3">
					<span
						className={`text-xs px-2 py-1 rounded-full font-medium ${
							lead.status === "won"
								? "bg-green-100 text-green-700"
								: lead.status === "lost"
									? "bg-red-100 text-red-700"
									: lead.status === "contacted"
										? "bg-blue-100 text-blue-700"
										: "bg-yellow-100 text-yellow-700"
						}`}
					>
						{lead.status.replace(/_/g, ' ')}
					</span>
				</td>

				{/* Status Update */}
				<td className="p-3">
					<select
						value={lead.status}
						onChange={(e) => onStatusChange(lead.id, e.target.value)}
						className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
					>
						{STATUS_OPTIONS.filter((status) =>
							allowedStatuses.includes(status.value),
						).map((status) => (
							<option key={status.value} value={status.value}>
								{status.label}
							</option>
						))}
					</select>
				</td>
				<td className="px-3">
					<button
						onClick={() => setSelectedLead(lead)}
						className="p-1 rounded-full hover:bg-gray-100 transition"
					>
						<CircleChevronRight size={20} color="#828282" />
					</button>
				</td>
			</tr>

			{/* {selectedLead && (
            <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )} */}
			{selectedLead && (
				<LeadDetailsDrawer
					lead={selectedLead}
					onClose={() => setSelectedLead(null)}
					onStatusChange={onStatusChange}
				/>
			)}
		</>
	);
}
