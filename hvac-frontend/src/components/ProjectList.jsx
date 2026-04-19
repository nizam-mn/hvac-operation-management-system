import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProjectDetailModal from "./ProjectDetailModal";
import ProjectForm from "../modules/projects/ProjectForm";
import { useLocation } from "react-router-dom";
import ProjectTasks from "./ProjectTasks";

export default function ProjectList({
	projectsWithoutInvoice,
	// setSelectedQuotation,
	// setSelectedProjectForm,
	setSelectedProjectForInvoice,
}) {
	const [projects, setProjects] = useState([]);
	const [selectedProjectForm, setSelectedProjectForm] = useState(null);
	const [selectedQuotation, setSelectedQuotation] = useState(null);
	const [selectedProjectForProgress, setSelectedProjectForProgress] =
		useState(null);

	const path = useLocation().pathname;

	const { user } = useAuth();

	const fetchProjects = async () => {
		try {
			const res = await api.get("/projects");
			setProjects(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (["finance", "admin"].includes(user.role) && path === "/invoices") {
			setProjects(projectsWithoutInvoice);
		} else {
			fetchProjects();
		}
	}, [user.role, projectsWithoutInvoice]);

	const handleView = async (quotationId) => {
		try {
			const res = await api.get(`/quotations/${quotationId}`);
			setSelectedQuotation(res.data.data);
		} catch (err) {
			console.log(err);
			alert("Failed to fetch quotation");
		}
	};

	const getStatusStyle = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-700";
			case "in_progress":
				return "bg-yellow-100 text-yellow-700";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

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
			<div className="w-full">
				<table className="w-full border-separate border-spacing-y-3 md:border-collapse md:border-spacing-0">
					{/* Desktop header only */}
					<thead className="hidden md:table-header-group bg-gray-50 text-sm text-gray-700">
						<tr>
							<th className="px-5 py-3 text-left">Project</th>
							<th className="px-5 py-3 text-left">Status</th>
							<th className="px-5 py-3 text-left">Start</th>
							<th className="px-5 py-3 text-left">End</th>
							<th className="px-5 py-3 text-left">Assigned To</th>
							<th className="px-5 py-3 text-right">Actions</th>
						</tr>
					</thead>

					<tbody>
						{projects?.map((p) => (
							<tr
								key={p.id}
								className="
                bg-white shadow-sm rounded-xl md:rounded-none
                md:shadow-none md:border-t
                flex flex-col md:table-row
                p-4 md:p-0
              "
							>
								{/* Project Name */}
								<td className="md:px-5 md:py-4 font-semibold text-gray-800">
									{p.name}
								</td>

								{/* Status */}
								<td className="md:px-5 md:py-4 mt-2 md:mt-0">
									<span
										className={`text-xs px-2.5 py-1 rounded-full ${getStatusStyle(
											p.status,
										)}`}
									>
										{p.status.replace("_", " ")}
									</span>
								</td>

								{/* Dates */}
								<td className="md:px-5 md:py-4 mt-2 md:mt-0 text-sm text-gray-600">
									<span className="md:hidden font-medium">Start: </span>
									{new Date(p.startDate).toLocaleDateString()}
								</td>

								<td className="md:px-5 md:py-4 text-sm text-gray-600">
									<span className="md:hidden font-medium">End: </span>
									{new Date(p.endDate).toLocaleDateString()}
								</td>

								{/* Assigned To */}
								<td className="md:px-5 md:py-4 text-sm text-gray-600">
									<span className="md:hidden font-medium">Assigned To: </span>
									{getAssignedToName(p.assignedTo)}
								</td>

								{/* Actions */}
								<td className="md:px-5 md:py-4 mt-4 md:mt-0">
									<div className="flex gap-2 md:justify-end">
										<button
											onClick={() => handleView(p.quotationId)}
											className="flex-1 md:flex-none px-3 py-2 md:py-1.5 rounded-lg bg-red-600 text-white text-sm md:text-xs hover:bg-red-700"
										>
											View
										</button>

										{["project", "admin"].includes(user.role) && (
											<button
												onClick={() => setSelectedProjectForProgress(p.id)}
												className="flex-1 md:flex-none px-3 py-2 md:py-1.5 rounded-lg bg-blue-600 text-white text-sm md:text-xs hover:bg-blue-700"
											>
												Progress
											</button>
										)}

										{["project", "admin"].includes(user.role) && (
											<button
												onClick={() => setSelectedProjectForm(p)}
												className="flex-1 md:flex-none px-3 py-2 md:py-1.5 rounded-lg bg-blue-600 text-white text-sm md:text-xs hover:bg-blue-700"
											>
												Edit
											</button>
										)}

										{user.role === "finance" && (
											<button
												onClick={() => setSelectedProjectForInvoice(p)}
												className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
											>
												Create Invoice
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{selectedProjectForProgress && (
				<ProjectTasks
					projectId={selectedProjectForProgress}
					onClose={() => setSelectedProjectForProgress(null)}
				/>
			)}

			<ProjectDetailModal
				project={selectedQuotation?.project}
				quotation={selectedQuotation?.quotation}
				quoteItem={selectedQuotation?.items}
				onClose={() => setSelectedQuotation(null)}
				onSuccess={fetchProjects}
			/>

			{/* Modal */}
			{["project", "admin"].includes(user.role) && selectedProjectForm && (
				<ProjectForm
					project={selectedProjectForm}
					onClose={() => setSelectedProjectForm(null)}
					onSuccess={fetchProjects}
				/>
			)}
		</>
	);
}
