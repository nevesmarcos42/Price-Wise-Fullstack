import { useEffect, useState } from "react";
import { getProdutos } from "../services/api";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";

export default function Products() {
  const [produtos, setProdutos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

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
        const response = await getProdutos(filters);
        setProdutos(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchData();
  }, [filters]);

  return (
    <main className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">
        🛍️ Produtos disponíveis
      </h2>

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center">
            Nenhum produto encontrado.
          </p>
        ) : (
          produtos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))
        )}
      </div>

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
