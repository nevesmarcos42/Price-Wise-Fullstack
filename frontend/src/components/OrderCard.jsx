export default function OrderCard({
  orderId,
  productNames,
  totalFinal,
  couponCode,
  createdAt,
}) {
  // Cores estilizadas com base no cupom
  const couponColors = {
    promo10: "bg-green-100 text-green-800 border-green-300",
    promo20: "bg-yellow-100 text-yellow-800 border-yellow-300",
    blackfriday: "bg-purple-100 text-purple-800 border-purple-300",
  };

  // Estilo baseado no cupom
  const statusStyle =
    couponColors[couponCode?.toLowerCase()] ||
    "bg-blue-50 text-blue-800 border-blue-200";

  // Converts product array to text
  const produtosFormatados = Array.isArray(productNames)
    ? productNames.join(", ")
    : "Products not informed";

  // Format date
  const dataFormatada = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date unavailable";

  return (
    <div className="border-2 rounded-lg shadow-md p-5 bg-white hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📦</span>
            <h3 className="text-sm font-semibold text-gray-500">
              Order #{orderId}
            </h3>
          </div>
          <p className="text-gray-800 font-medium line-clamp-2">
            {produtosFormatados}
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Total Value:</span>
          <span className="font-bold text-lg text-green-600">
            $ {totalFinal?.toFixed(2) || "0.00"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>🕒</span>
          <span>{dataFormatada}</span>
        </div>

        {couponCode && (
          <div
            className={`mt-3 px-3 py-2 rounded-lg border-2 ${statusStyle} text-center`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🎟️</span>
              <span className="font-semibold text-sm">
                {couponCode.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
