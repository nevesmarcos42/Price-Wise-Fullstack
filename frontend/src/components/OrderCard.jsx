export default function OrderCard({
  productNames,
  totalFinal,
  couponCode,
  createdAt,
}) {
  // Cores estilizadas com base no cupom
  const couponColors = {
    promo10: "bg-green-100 text-green-800",
    promo20: "bg-yellow-100 text-yellow-800",
    blackfriday: "bg-purple-100 text-purple-800",
  };

  // Estilo baseado no cupom
  const statusStyle =
    couponColors[couponCode?.toLowerCase()] || "bg-gray-100 text-gray-800";

  // Converte array de produtos para texto
  const produtosFormatados = Array.isArray(productNames)
    ? productNames.join(", ")
    : "Produtos não informados";

  // Formata a data
  const dataFormatada = createdAt
    ? new Date(createdAt).toLocaleDateString("pt-BR")
    : "Data indisponível";

  return (
    <div className="w-1/3 border rounded-lg shadow-sm p-4 bg-white flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-800">
        {produtosFormatados}
      </h3>

      <p className="text-gray-700">
        Valor final:{" "}
        <span className="font-bold">R${totalFinal?.toFixed(2) || "0.00"}</span>
      </p>

      <p className="text-gray-600">Data: {dataFormatada}</p>

      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyle}`}
      >
        Cupom: {couponCode || "sem cupom"}
      </span>
    </div>
  );
}
