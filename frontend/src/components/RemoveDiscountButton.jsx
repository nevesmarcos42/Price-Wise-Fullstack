import { useState } from "react";
import { removeDesconto } from "../services/api";

export default function RemoveDiscountButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeDesconto(productId);
      setFeedback("Discount removed successfully.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Error removing discount.");
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleRemove}
        disabled={loading}
        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
      >
        Remove Discount
      </button>

      {feedback && (
        <span className="text-sm text-gray-600 pt-1">{feedback}</span>
      )}
    </div>
  );
}
