import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PaymentsDrawer({ invoice, onClose }) {
	const [payments, setPayments] = useState([]);
	const [amount, setAmount] = useState("");
	const [type, setType] = useState("partial");

	const fetchPayments = async () => {
		const res = await api.get(`/payments/${invoice.id}`);
		setPayments(res.data.data);
	};

	useEffect(() => {
		fetchPayments();
	}, []);

    console.log(payments)

	const handleAddPayment = async () => {
		try {
			await api.post("/payments", {
				invoiceId: invoice.id,
				amount: Number(amount),
				type,
			});

			setAmount("");
			fetchPayments();
		} catch (err) {
			alert(err.response?.data?.message || "Error");
            console.log(err)
		}
	};

	// 🔥 calculate totals
	const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

	const remaining = Number(invoice.amount) - totalPaid;

	return (
		<div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
			<div className="w-[400px] bg-white h-full p-6 overflow-y-auto">
				<h3 className="text-lg font-semibold mb-4">Payments</h3>

				{/* Summary */}
				<div className="mb-4">
					<p>Total: ₹{invoice.amount}</p>
					<p>Paid: ₹{totalPaid}</p>
					<p className="font-semibold">Remaining: ₹{remaining}</p>
				</div>

				{/* Add Payment */}
				<div className="mb-6 border p-3 rounded">
					<h4 className="font-medium mb-2">Add Payment</h4>

					<input
						type="number"
						placeholder="Amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full border p-2 rounded mb-2"
					/>

					<select
						value={type}
						onChange={(e) => setType(e.target.value)}
						className="w-full border p-2 rounded mb-2"
					>
						<option value="advance">Advance</option>
						<option value="partial">Partial</option>
						<option value="final">Final</option>
					</select>

					<button
						onClick={handleAddPayment}
						className="bg-blue-600 text-white w-full py-2 rounded"
					>
						Add Payment
					</button>
				</div>

				{/* Payment List */}
				<div>
					<h4 className="font-medium mb-2">History</h4>

					{payments.map((p) => (
						<div key={p.id} className="border p-2 rounded mb-2 text-sm">
							<p>₹{p.amount}</p>
							<p className="text-gray-500">{p.type}</p>
							<p className="text-gray-400">
								{new Date(p.paidAt).toLocaleDateString()}
							</p>
						</div>
					))}
				</div>

				<button onClick={onClose} className="mt-4 w-full border py-2 rounded">
					Close
				</button>
			</div>
		</div>
	);
}
