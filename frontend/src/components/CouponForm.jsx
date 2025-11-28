import { useState } from "react";
import { postCupom } from "../services/api";

export default function CouponForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    code: "",
    type: "percent",
    discountValue: "",
    oneShot: false,
    validFrom: "",
    validUntil: "",
  });

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validarCupom = () => {
    if (!formData.code.trim()) return "Code is required.";
    if (!formData.discountValue || Number(formData.discountValue) <= 0)
      return "Value must be greater than 0.";
    if (!formData.validFrom || !formData.validUntil)
      return "Validity period required.";
    if (formData.type === "percent" && Number(formData.discountValue) > 100)
      return "Maximum percentage is 100%.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarCupom();
    if (erro) {
      setFeedback(erro);
      return;
    }

    setLoading(true);
    try {
      await postCupom(formData);
      setFeedback("Coupon registered successfully!");
      setFormData({
        code: "",
        type: "percent",
        discountValue: "",
        oneShot: false,
        validFrom: "",
        validUntil: "",
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setFeedback("Code already exists.");
      } else {
        setFeedback(
          error.response?.data?.message || "Error registering coupon."
        );
      }
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(""), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="coupon-code"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Código do Cupom *
          </label>
          <input
            id="coupon-code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Ex: PROMO10"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="discount-type"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Tipo de Desconto *
          </label>
          <select
            id="discount-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="percent">Percentual (%)</option>
            <option value="fixed">Valor Fixo (R$)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="discount-value"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Valor do Desconto *
          </label>
          <input
            id="discount-value"
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder={formData.type === "fixed" ? "Ex: 50.00" : "Ex: 10"}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center pt-8">
          <input
            id="one-shot"
            type="checkbox"
            name="oneShot"
            checked={formData.oneShot}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="one-shot" className="ml-2 text-sm text-gray-700">
            Cupom de uso único
          </label>
        </div>

        <div>
          <label
            htmlFor="valid-from"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Válido de *
          </label>
          <input
            id="valid-from"
            type="datetime-local"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="valid-until"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Válido até *
          </label>
          <input
            id="valid-until"
            type="datetime-local"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded ${
            feedback.includes("sucesso")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? "Criando..." : "Criar Cupom"}
      </button>
    </form>
  );
}
