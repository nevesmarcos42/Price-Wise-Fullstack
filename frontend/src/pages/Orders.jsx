import OrderCard from "../components/OrderCard.jsx";
import { useEffect, useState } from "react";
import { getPedidos } from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Orders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
  });

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const dados = await getPedidos();
        setPedidos(dados);

        // Calcular estatísticas
        const totalValue = dados.reduce(
          (acc, p) => acc + (p.totalFinal || 0),
          0
        );
        setStats({
          total: dados.length,
          totalValue: totalValue,
        });
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setErro("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    }

    buscarPedidos();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-blue-700">📦 Order History</h2>
        <p className="text-gray-600 mt-2">View all orders placed</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Value</p>
              <p className="text-3xl font-bold mt-2">
                $ {stats.totalValue.toFixed(2)}
              </p>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
        </div>
      </div>

      {erro && <ErrorMessage message={erro} />}

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Placed Orders</h3>

        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">
              Place your first order on the Checkout page
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidos.map((pedido) => (
                <OrderCard
                  key={pedido.orderId}
                  orderId={pedido.orderId}
                  productNames={pedido.productNames}
                  totalFinal={pedido.totalFinal}
                  couponCode={pedido.couponCode}
                  createdAt={pedido.createdAt}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
