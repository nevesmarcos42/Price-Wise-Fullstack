export default function Pagination({ page, totalPages, onPageChange }) {
  const previous = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const next = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex justify-center items-center gap-4 pt-4">
      <button
        onClick={previous}
        disabled={page === 1}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        ← Página anterior
      </button>

      <span className="text-sm text-gray-600 font-semibold">
        Página {page} de {totalPages}
      </span>

      <button
        onClick={next}
        disabled={page >= totalPages}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Próxima página →
      </button>
    </div>
  );
}
