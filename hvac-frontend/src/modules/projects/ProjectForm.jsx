import { useEffect, useState } from "react";
import api from "../../api/axios";
import { X } from "lucide-react";

export default function ProjectForm({ project, onClose, onSuccess }) {
	const [form, setForm] = useState({
		assignedTo: project.assignedTo || "",
		startDate: project.startDate || "",
		endDate: project.endDate || "",
		status: project.status || "initiated",
	});

    const [users, setProjectUsers] = useState([]);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async () => {
		try {
			await api.patch(`/projects/${project.id}`, form);
			onSuccess();
			onClose();
		} catch (err) {
			alert(err.response?.data?.message || "Error updating project");
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await api.get("/users?role=project");
			setProjectUsers(res.data.data);
		};

		fetchUsers();
	}, []);

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
			<div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-gray-200">
				{/* Header */}
				<div className="border-b px-6 py-4 flex justify-between items-center">
					<div>
						<h3 className="text-lg font-semibold text-gray-800">
							Project Details
						</h3>
						<p className="text-sm text-gray-500">{project.name}</p>
					</div>
					<button onClick={onClose} className="hover:text-gray-600 text-xl">
						<X size={20} />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 space-y-4">
					{/* Assigned To */}
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1">
							Assigned Technician
						</label>
						<select
							name="assignedTo"
							value={form.assignedTo}
							onChange={handleChange}
						>
							<option value="">Select Technician</option>

							{users.map((u) => (
								<option key={u.id} value={u.id}>
									{u.name}
								</option>
							))}
						</select>
					</div>

					{/* Dates Row */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1">
								Start Date
							</label>
							<input
								type="date"
								name="startDate"
								value={form.startDate}
								onChange={handleChange}
								className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2.5 rounded-lg outline-none transition"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1">
								End Date
							</label>
							<input
								type="date"
								name="endDate"
								value={form.endDate}
								onChange={handleChange}
								className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2.5 rounded-lg outline-none transition"
							/>
						</div>
					</div>

					{/* Status */}
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1">
							Status
						</label>
						<select
							name="status"
							value={form.status}
							onChange={handleChange}
							className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2.5 rounded-lg outline-none transition"
						>
							<option value="initiated">Initiated</option>
							<option value="in_progress">In Progress</option>
							<option value="completed">Completed</option>
						</select>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit}
						className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}
