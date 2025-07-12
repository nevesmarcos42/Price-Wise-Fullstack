import OrderCard from "../components/OrderCard.jsx";
import { useEffect, useState } from "react";
import { getPedidos } from "../services/api.js";

export default function Orders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const dados = await getPedidos();
        setPedidos(dados);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setErro("Não foi possível carregar os pedidos.");
      } finally {
        setLoading(false);
      }
    }

    buscarPedidos();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">📦 Pedidos</h2>

      {loading && <p className="text-gray-500">Carregando pedidos...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos.map((pedido) => (
          <OrderCard
            key={pedido.orderId}
            productNames={pedido.productNames}
            totalFinal={pedido.totalFinal}
            couponCode={pedido.couponCode}
            createdAt={pedido.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
