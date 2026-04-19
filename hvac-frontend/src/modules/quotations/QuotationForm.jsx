import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function QuotationForm() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);

  const [items, setItems] = useState([
    { itemName: "", quantity: 1, unitPrice: 0 },
  ]);

  // 🔥 Fetch lead details
  useEffect(() => {
    const fetchLead = async () => {
      const res = await api.get("/leads");
      const selected = res.data.data.find((l) => l.id === leadId);
      setLead(selected);
    };

    fetchLead();
  }, [leadId]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { itemName: "", quantity: 1, unitPrice: 0 }]);
  };

  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = async () => {
    try {
      await api.post("/quotations", {
        leadId,
        title: `Quotation - ${lead?.title || ""}`,
        items,
      });

      navigate("/quotations");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

    const handleDownload = () => {
    window.print(); // simple download/print
  };

  if (!lead) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6">

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create Quotation
      </h2>

      {/* Lead Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700">{lead.title}</h3>
        <p className="text-sm text-gray-600">{lead.clientName}</p>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-500 mb-2 px-2">
        <span>Item</span>
        <span>Qty</span>
        <span>Price</span>
        <span className="text-right">Total</span>
        <span></span>
      </div>

      {/* Items */}
      {items.map((item, index) => {
        const lineTotal = item.quantity * item.unitPrice;

        return (
          <div key={index} className="grid grid-cols-5 gap-4 items-center bg-gray-50 border border-gray-200 p-3 rounded-lg mb-2">

            <input
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Item Name"
              onChange={(e) =>
                handleItemChange(index, "itemName", e.target.value)
              }
            />

            <input
              type="number"
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Qty"
              onChange={(e) =>
                handleItemChange(index, "quantity", Number(e.target.value))
              }
            />

            <input
              type="number"
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Price"
              onChange={(e) =>
                handleItemChange(index, "unitPrice", Number(e.target.value))
              }
            />

            <span className="text-right font-semibold">
              ₹{lineTotal}
            </span>

            <button
              onClick={() => deleteItem(index)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>

          </div>
        );
      })}

      {/* Add Item */}
      <button
        onClick={addItem}
        className="mt-3 text-blue-600 text-sm font-medium"
      >
        + Add Item
      </button>

      {/* Total */}
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <span className="font-medium text-gray-600">Total</span>
        <span className="text-xl font-bold">₹{totalAmount}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Submit
        </button>

        <button
          onClick={handleDownload}
          className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
        >
          Download
        </button>
      </div>

    </div>

  );
}