import OrderCard from "../components/OrderCard";

const orders = [
  { id: 101, customer: "Marcos", total: 180.9 },
  { id: 102, customer: "Ana", total: 245.6 },
  { id: 103, customer: "Lucas", total: 89.99 },
];

export default function Orders() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Pedidos</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
