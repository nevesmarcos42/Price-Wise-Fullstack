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
        placeholder="Search by name..."
        className="border px-3 py-2 rounded text-gray-700"
      />

      {/*  Min price range */}
      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleChange}
        placeholder="Min price"
        className="border px-3 py-2 rounded text-gray-700"
      />

      {/*  Max price range */}
      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleChange}
        placeholder="Max price"
        className="border px-3 py-2 rounded text-gray-700"
      />

      {/*  Discount filter */}
      <label className="flex items-center space-x-2 text-sm text-gray-600">
        <input
          type="checkbox"
          name="hasDiscount"
          checked={filters.hasDiscount}
          onChange={handleChange}
        />
        <span>With discount</span>
      </label>
    </div>
  );
}
