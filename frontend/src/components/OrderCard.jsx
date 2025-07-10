export default function OrderCard({ order }) {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h3 className="text-xl font-bold text-gray-800">Pedido #{order.id}</h3>
      <p className="text-gray-600">Cliente: {order.customer}</p>
      <p className="text-green-600 font-semibold">Total: R${order.total}</p>
    </div>
  );
}
