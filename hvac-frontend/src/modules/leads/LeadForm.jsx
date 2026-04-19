import { useEffect, useState } from "react";
import api from "../../api/axios";
import { X } from "lucide-react";

export default function LeadForm({ onSuccess, onClose }) {
	const [form, setForm] = useState({
		title: "",
		clientName: "",
		phone: "",
		email: "",
		source: "",
		estimatedValue: "",
		assignedTo: "",
		siteVisitDate: "",
		notes: "",
	});

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const [salesUsers, setSalesUsers] = useState([]);

	const handleSubmit = async () => {
		try {
			await api.post("/leads", form);

			// reset form
			setForm({
				title: "",
				clientName: "",
				phone: "",
				email: "",
				source: "",
				estimatedValue: "",
				siteVisitDate: "",
				notes: "",
			});

			onSuccess();
			onClose();
		} catch (err) {
			alert(err.response?.data?.message || "Error creating lead");
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await api.get("/users?role=sales");
			setSalesUsers(res.data.data);
		};

		fetchUsers();
	}, []);

	return (
		<div className="bg-white p-4 rounded-xl shadow-sm border w-120 border-gray-200 mb-6">
			{/* Title */}
			<div className="flex items-start justify-between ">
				<h3 className="text-lg font-semibold text-gray-800 mb-2">
					Add New Lead
				</h3>
				<button className="cursor-pointer" onClick={onClose}>
					<X size={18} color="red" />
				</button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				{/* Project / Lead Name */}
				<div>
					<label className="block text-sm text-gray-600 mb-1">
						Project / Lead Name
					</label>
					<input
						name="title"
						value={form.title}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="e.g. Office HVAC Installation"
					/>
				</div>

				{/* Client Name */}
				<div>
					<label className="block text-sm text-gray-600 mb-1">
						Client Name
					</label>
					<input
						name="clientName"
						value={form.clientName}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="Client name"
					/>
				</div>

				{/* Phone */}
				<div>
					<label className="block text-sm text-gray-600 mb-1">Phone</label>
					<input
						name="phone"
						value={form.phone}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="Phone number"
					/>
				</div>

				{/* Email */}
				<div>
					<label className="block text-sm text-gray-600 mb-1">Email</label>
					<input
						name="email"
						value={form.email}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="email@example.com"
					/>
				</div>

				{/* Source */}
				<div>
					<label className="block text-sm text-gray-600 mb-1">
						Lead Source
					</label>
					<select
						name="source"
						value={form.source}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
					>
						<option value="">Select Source</option>
						<option value="Social Media">Social Media</option>
						<option value="Referral">Referral</option>
						<option value="Walk-in">Walk-in</option>
					</select>
				</div>

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

						{salesUsers.map((u) => (
							<option key={u.id} value={u.id}>
								{u.name}
							</option>
						))}
					</select>
				</div>

				{/* Estimated Value */}
				<div>
					<label className="block text-sm text-gray-600 mb-1">
						Estimated Value (₹)
					</label>
					<input
						name="estimatedValue"
						value={form.estimatedValue}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="e.g. 150000"
					/>
				</div>

				{/* Site Visit Date */}
				<div>
					<label className="block text-sm text-gray-600 mb-1">
						Site Visit Date
					</label>
					<input
						type="date"
						name="siteVisitDate"
						value={form.siteVisitDate}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
					/>
				</div>

				{/* Notes (Full width) */}
				<div className="md:col-span-2">
					<label className="block text-sm text-gray-600 mb-1">Notes</label>
					<textarea
						name="notes"
						value={form.notes}
						onChange={handleChange}
						rows="3"
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="Additional details..."
					/>
				</div>
			</div>

			{/* Submit Button */}
			<div className="mt-6 text-right">
				<button
					onClick={handleSubmit}
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
				>
					Create Lead
				</button>
			</div>
		</div>
	);
}
