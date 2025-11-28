import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutos } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Products() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    hasDiscount: false,
    page: 1,
    limit: 9, // 3x3 grid visual
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getProdutos(filters);
        setProdutos(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-700">
          🛍️ Available Products
        </h2>
        {isAdmin && (
          <button
            onClick={() => navigate("/add-product")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            ➕ Add Product
          </button>
        )}
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.length === 0 ? (
              <p className="text-gray-500 col-span-3 text-center">
                No products found.
              </p>
            ) : (
              produtos.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))
            )}
          </div>
        </div>
      )}

      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(newPage) =>
          setFilters((prev) => ({ ...prev, page: newPage }))
        }
      />
    </main>
  );
}
