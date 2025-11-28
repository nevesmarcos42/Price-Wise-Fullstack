import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutos } from "../services/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    productsWithDiscount: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getProdutos({ page: 1, limit: 6 });
        setProducts(response.data || []);
        setStats({
          totalProducts: response.totalItems || 0,
          productsWithDiscount: (response.data || []).filter(
            (p) => p.discountPrice
          ).length,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-blue-700">
          🏪 Dashboard - Price Wise
        </h1>
        <p className="text-gray-600">
          Welcome to the product and order management system
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Products</p>
              <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">With Discount</p>
              <p className="text-3xl font-bold mt-2">
                {stats.productsWithDiscount}
              </p>
            </div>
            <div className="text-5xl opacity-20">🏷️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">System</p>
              <p className="text-xl font-bold mt-2">Active ✓</p>
            </div>
            <div className="text-5xl opacity-20">⚡</div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/produtos")}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">🛍️</div>
            <div className="font-semibold text-gray-800">View Products</div>
            <div className="text-sm text-gray-500">Full catalog</div>
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-semibold text-gray-800">Place Order</div>
            <div className="text-sm text-gray-500">New checkout</div>
          </button>

          <button
            onClick={() => navigate("/cupons")}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">🎟️</div>
            <div className="font-semibold text-gray-800">Coupons</div>
            <div className="text-sm text-gray-500">Manage coupons</div>
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold text-gray-800">Orders</div>
            <div className="text-sm text-gray-500">History</div>
          </button>
        </div>
      </div>

      {/* Produtos em Destaque */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            🌟 Featured Products
          </h2>
          <button
            onClick={() => navigate("/produtos")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
          >
            View all →
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length === 0 ? (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No products registered yet.
              </p>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} produto={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
