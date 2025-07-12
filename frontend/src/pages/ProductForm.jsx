import { useState } from "react";
import { postProduto } from "../services/api";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    if (!formData.name.trim()) return "Nome é obrigatório.";
    if (Number(formData.price) < 1) return "Preço mínimo é R$1.00.";
    if (Number(formData.stock) < 1) return "Estoque deve ser no mínimo 1.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarCampos();
    if (erro) {
      setStatus(erro);
      return;
    }

    setLoading(true);
    try {
      await postProduto(formData);
      setStatus("Produto cadastrado com sucesso.");
      setFormData({ name: "", description: "", price: "", stock: "" });
    } catch (error) {
      if (error.response?.status === 409) {
        setStatus("Nome já cadastrado.");
      } else {
        setStatus("Erro ao cadastrar produto.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow space-y-4 max-w-lg mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-700">
        📦 Cadastro de Produto
      </h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome do produto"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descrição"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Preço"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Estoque"
        className="w-full border px-3 py-2 rounded"
      />

      {status && <p className="text-sm text-gray-600">{status}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Cadastrar"}
      </button>
    </form>
  );
}
