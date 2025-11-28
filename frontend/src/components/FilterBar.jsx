export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      page: 1, // sempre volta pra primeira página ao aplicar filtro
    }));
  };

  return (
    <div className="bg-white shadow-sm p-4 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">
      {/*  Buscar por nome */}
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Buscar por nome..."
        className="border px-3 py-2 rounded text-gray-700"
      />

      {/*  Faixa de preço mínima */}
      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleChange}
        placeholder="Preço mínimo"
        className="border px-3 py-2 rounded text-gray-700"
      />

      {/*  Faixa de preço máxima */}
      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleChange}
        placeholder="Preço máximo"
        className="border px-3 py-2 rounded text-gray-700"
      />

      {/*  Filtro de desconto ativo */}
      <label className="flex items-center space-x-2 text-sm text-gray-600">
        <input
          type="checkbox"
          name="hasDiscount"
          checked={filters.hasDiscount}
          onChange={handleChange}
        />
        <span>Com desconto</span>
      </label>
    </div>
  );
}
