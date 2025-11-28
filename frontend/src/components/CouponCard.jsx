export default function CouponCard({ cupom }) {
  const { code, type, value, oneShot, validFrom, validUntil } = cupom;

  // Estilos por tipo de desconto
  const tipoStyle =
    type === "percent"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  // Valor formatado
  const valorFormatado =
    type === "percent" ? `${value}%` : `R$${value?.toFixed(2)}`;

  // Datas formatadas
  const formatarData = (data) =>
    data ? new Date(data).toLocaleDateString("pt-BR") : "Indefinida";

  // Validade dinâmica
  const isValido = new Date(validUntil) >= new Date();
  const validadeStyle = isValido
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <div className="w-1/2 border rounded-lg shadow-sm p-4 bg-white flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-800">{code}</h3>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          Tipo: <span className={`px-2 py-1 rounded ${tipoStyle}`}>{type}</span>
        </p>
        <p>Valor: {valorFormatado}</p>
        <p>Uso único: {oneShot ? "Sim" : "Não"}</p>
        <p
          className={`px-2 py-1 rounded ${validadeStyle} text-center self-center`}
        >
          Validade: {formatarData(validFrom)} → {formatarData(validUntil)}
        </p>
      </div>
    </div>
  );
}
