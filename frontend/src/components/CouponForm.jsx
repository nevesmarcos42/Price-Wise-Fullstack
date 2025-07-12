import { useState } from "react";
import { postCupom } from "../services/api";

export default function CouponForm() {
  const [formData, setFormData] = useState({
    code: "",
    type: "percent",
    value: "",
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
    if (!formData.code.trim()) return "Código é obrigatório.";
    if (!formData.value || Number(formData.value) <= 0)
      return "Valor deve ser maior que 0.";
    if (!formData.validFrom || !formData.validUntil)
      return "Período de validade obrigatório.";
    if (formData.type === "percent" && Number(formData.value) > 100)
      return "Percentual máximo é 100%.";
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
      setFeedback("Cupom cadastrado com sucesso.");
      setFormData({
        code: "",
        type: "percent",
        value: "",
        oneShot: false,
        validFrom: "",
        validUntil: "",
      });
    } catch (error) {
      if (error.response?.status === 409) {
        setFeedback("Código já existente.");
      } else {
        setFeedback("Erro ao cadastrar cupom.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow space-y-4 max-w-lg mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-700">🎟️ Criar Cupom</h2>

      <input
        name="code"
        value={formData.code}
        onChange={handleChange}
        placeholder="Código do cupom"
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="percent">Percentual (%)</option>
        <option value="fixed">Valor fixo (R$)</option>
      </select>

      <input
        type="number"
        name="value"
        value={formData.value}
        onChange={handleChange}
        placeholder={formData.type === "fixed" ? "Valor em R$" : "Percentual"}
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="oneShot"
          checked={formData.oneShot}
          onChange={handleChange}
        />
        <label className="text-sm text-gray-600">Cupom de uso único</label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          name="validFrom"
          value={formData.validFrom}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="validUntil"
          value={formData.validUntil}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
      </div>

      {feedback && <p className="text-sm text-gray-600">{feedback}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Criar Cupom"}
      </button>
    </form>
  );
}
