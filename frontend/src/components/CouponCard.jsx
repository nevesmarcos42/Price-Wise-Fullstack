export default function CouponCard({ cupom }) {
  const { code, type, value, oneShot, validFrom, validUntil } = cupom;

  // Estilos por tipo de desconto
  const tipoStyle =
    type === "percent"
      ? "bg-gradient-to-br from-green-100 to-green-200 border-green-300"
      : "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300";

  // Valor formatado
  const valorFormatado =
    type === "percent" ? `${value}%` : `R$ ${value?.toFixed(2)}`;

  // Datas formatadas
  const formatarData = (data) =>
    data
      ? new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "Indefinida";

  // Validity check
  const isValido = new Date(validUntil) >= new Date();
  const isProximo = new Date(validUntil) - new Date() < 7 * 24 * 60 * 60 * 1000; // 7 days

  const validadeStyle = isValido
    ? isProximo
      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
      : "bg-green-100 text-green-800 border-green-300"
    : "bg-red-100 text-red-800 border-red-300";

  const validadeTexto = isValido
    ? isProximo
      ? "⚠️ Expiring soon"
      : "✓ Active"
    : "✕ Expired";

  return (
    <div
      className={`border-2 rounded-lg shadow-md p-5 ${tipoStyle} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{type === "percent" ? "%" : "💰"}</span>
            <h3 className="text-xl font-bold text-gray-800">{code}</h3>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-blue-600">
              {valorFormatado}
            </span>
            <span className="text-sm text-gray-600">
              {type === "percent" ? "discount" : "OFF"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between py-2 border-t border-gray-300">
          <span className="text-gray-600">Tipo:</span>
          <span className="font-semibold">
            {type === "percent" ? "Percentual" : "Valor Fixo"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-300">
          <span className="text-gray-600">Uso único:</span>
          <span className="font-semibold">{oneShot ? "✓ Sim" : "✕ Não"}</span>
        </div>

        <div className="py-2 border-t border-gray-300">
          <p className="text-gray-600 mb-1">Validade:</p>
          <p className="text-xs text-gray-700">
            De: <span className="font-semibold">{formatarData(validFrom)}</span>
          </p>
          <p className="text-xs text-gray-700">
            Até:{" "}
            <span className="font-semibold">{formatarData(validUntil)}</span>
          </p>
        </div>

        <div
          className={`mt-3 px-3 py-2 rounded-lg border-2 ${validadeStyle} text-center font-semibold`}
        >
          {validadeTexto}
        </div>
      </div>
    </div>
  );
}
