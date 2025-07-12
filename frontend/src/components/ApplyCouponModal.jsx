export default function ApplyCouponModal() {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Aplicar Cupom</h2>
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Código do cupom"
      />
      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Aplicar
      </button>
    </div>
  );
}
