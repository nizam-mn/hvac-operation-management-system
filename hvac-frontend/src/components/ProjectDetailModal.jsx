import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetailModal({
	project,
	quotation,
	quoteItem,
	onClose,
}) {
	if (!quotation) return null;

    const {user} = useAuth();
	return (
		<div className="fixed inset-0 z-50 p-4 flex">
			<div
				onClick={onClose}
				className=" absolute inset-0 bg-black/40 backdrop-blur-sm"
			/>

			<div className="w-9/10 mx-auto relative bg-white rounded-xl shadow-xl p-6 overflow-y-auto animate-slide-in">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-xl font-semibold text-gray-800">
							Project Details
						</h3>
						<p className="text-sm text-gray-500">
							Related quotation: {quotation?.title}
						</p>
					</div>

					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X size={18} />
					</button>
				</div>

				<div className="grid gap-6">
					<div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
						<h4 className="text-lg font-semibold text-gray-900 mb-3">
							Project Info
						</h4>
						{project ? (
							<div className="space-y-3 text-sm text-gray-700">
								<div className="flex justify-between">
									<span className="font-medium">Name</span>
									<span>{project.name}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Status</span>
									<span>{project.status?.replace("_", " ")}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Start Date</span>
									<span>
										{project.startDate
											? new Date(project.startDate).toLocaleDateString()
											: "—"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">End Date</span>
									<span>
										{project.endDate
											? new Date(project.endDate).toLocaleDateString()
											: "—"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Budget</span>
									<span>{project.budget ? `₹${project.budget}` : "—"}</span>
								</div>
								<div>
									<p className="font-medium">Notes</p>
									<p className="mt-1 text-sm text-gray-600">
										{project.notes || "No notes available."}
									</p>
								</div>
							</div>
						) : (
							<div className="text-sm text-gray-600">
								No project record found for this quotation.
							</div>
						)}
					</div>

					<div className="rounded-xl border border-gray-200 p-5 bg-white">
						<h4 className="text-lg font-semibold text-gray-900 mb-3">
							Related Quotation
						</h4>
						<div className="space-y-3 text-sm text-gray-700">
							<div className="flex justify-between">
								<span className="font-medium">Title</span>
								<span>{quotation?.title}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">Status</span>
								<span>{quotation?.status}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">Total Amount</span>
								<span>₹{quotation?.totalAmount}</span>
							</div>
						</div>
					</div>
					{user.role !== "finance" && <div className="rounded-xl border border-gray-200 p-5 bg-white">
						<h4 className="text-lg font-semibold text-gray-900 mb-3">
							Quotation Items
						</h4>
						<div className="mt-4">
							{quoteItem && (
								<div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
									<table className="w-full text-sm text-left text-gray-700">
										{/* Header */}
										<thead className="bg-gray-100 text-gray-600 uppercase text-xs">
											<tr>
												<th className="px-4 py-3 font-medium">Item</th>
												<th className="px-4 py-3 font-medium text-center">
													Qty
												</th>
												<th className="px-4 py-3 font-medium text-right">
													Unit Price
												</th>
												<th className="px-4 py-3 font-medium text-right">
													Total
												</th>
											</tr>
										</thead>

										{/* Body */}
										<tbody>
											{quoteItem.map((item, index) => (
												<tr
													key={item.id}
													className={`border-t ${
														index % 2 === 0 ? "bg-white" : "bg-gray-50"
													} hover:bg-blue-50 transition`}
												>
													<td className="px-4 py-3 font-medium text-gray-800">
														{item.itemName}
													</td>

													<td className="px-4 py-3 text-center">
														{item.quantity}
													</td>

													<td className="px-4 py-3 text-right">
														₹{item.unitPrice}
													</td>

													<td className="px-4 py-3 text-right font-semibold text-gray-900">
														₹{item.total}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>}
				</div>

				<div className="mt-6">
					<button
						onClick={onClose}
						className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
