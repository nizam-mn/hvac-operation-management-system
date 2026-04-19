import { useEffect, useState } from "react";
import api from "../../api/axios";
import LeadForm from "./LeadForm";
import { Plus } from "lucide-react";
import LeadItem from "../../components/LeadItem";
import LeadsList from "../../components/LeadList";
import { useAuth } from "../../context/AuthContext";

export default function LeadsPage() {
	const [showForm, setShowForm] = useState(false);
	const { user } = useAuth();

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			{/* Header */}
			<div className="mb-6 flex justify-between items-center">
				<h2 className="text-2xl font-semibold text-gray-800">
					Leads Management
				</h2>
				{["marketing", "admin"].includes(user.role) && (
					<button
						onClick={() => setShowForm(true)}
						className="flex justify-between items-center py-1.5 px-2 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
					>
						<Plus size={16} color="white" />
						<span className="">Add Leads</span>
					</button>
				)}
			</div>

			<LeadsList showForm={showForm} setShowForm={setShowForm} />
		</div>
	);
}
