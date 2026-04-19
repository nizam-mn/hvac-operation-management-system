import { X } from "lucide-react";

export default function QuoteDetailsDrawer({ quotation, onClose }) {
	if (!quotation) return null;
    console.log({quotation})
	 const { quotation: q, items } = quotation;

	const getStatusStyle = (status) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-700";
			case "rejected":
				return "bg-red-100 text-red-700";
			case "draft":
				return "bg-yellow-100 text-yellow-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex">
			{/* Overlay */}
			<div onClick={onClose} className="flex-1 bg-black/40 backdrop-blur-sm" />

			{/* Drawer */}
			<div className="w-full max-w-md bg-white shadow-xl h-full p-6 overflow-y-auto animate-slide-in">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-semibold text-gray-800">
						Quotation Details
					</h3>

					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X size={18} />
					</button>
				</div>

				{/* Title */}
				<h2 className="text-lg font-semibold text-gray-900 mb-4">{q.title}</h2>

				{/* Status + Total */}
				<div className="flex items-center justify-between mb-6">
					<span
						className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
							q.status,
						)}`}
					>
						{q.status}
					</span>

					<span className="text-lg font-semibold text-gray-800">
						₹{q.totalAmount}
					</span>
				</div>

				{/* Items Section */}
				<div className="mb-6">
					<h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
						Line Items
					</h4>

					<div className="space-y-3">
						{quotation.items?.map((item) => (
							<div
								key={item.id}
								className="border rounded-lg p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
							>
								<div>
									<p className="font-medium text-gray-800">{item.itemName}</p>
									<p className="text-xs text-gray-500">
										{item.quantity} × ₹{item.unitPrice}
									</p>
								</div>

								<p className="font-semibold text-gray-700">₹{item.total}</p>
							</div>
						))}
					</div>
				</div>

				{/* Summary Section */}
				<div className="space-y-3 text-sm border-t pt-4">
					<div className="flex justify-between">
						<p className="text-gray-500">Subtotal</p>
						<p className="text-gray-800 font-medium">₹{q.totalAmount}</p>
					</div>

					{/* Add tax/discount later if needed */}
				</div>

				{/* Footer Actions */}
				{/* <div className="mt-8 flex gap-3">
					<button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
						Download PDF
					</button>

					<button className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900">
						Share
					</button>
				</div> */}

				{/* Close Button */}
				<button
					onClick={onClose}
					className="mt-4 w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
				>
					Close
				</button>
			</div>
		</div>
	);
}
