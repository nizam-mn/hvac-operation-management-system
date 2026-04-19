import { useState } from "react";

export default function InvoiceModal({ project, onClose, onSubmit }) {
	const [amount, setAmount] = useState(project.quotationAmount || "");
	const [dueDate, setDueDate] = useState("");

	return (
		<div className="fixed inset-0 bg-black/50 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg w-[350px]">
				<h3 className="font-semibold mb-3">Create Invoice</h3>

				<p className="text-sm mb-2">{project.name}</p>

				<input
					type="number"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="w-full border p-2 rounded mb-4"
				/>

				<input
					type="date"
					name="startDate"
					value={project.dueDate}
					onChange={(e) => setDueDate(e.target.value)}
					className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2.5 rounded-lg outline-none transition"
				/>

				<div className="flex justify-end gap-2">
					<button onClick={onClose} className="border px-3 py-1 rounded">
						Cancel
					</button>

					<button
						onClick={() => onSubmit(amount, dueDate)}
						className="bg-blue-600 text-white px-3 py-1 rounded"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
}
