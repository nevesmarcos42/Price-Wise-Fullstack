import ApplyCouponModal from "./ApplyCouponModal";
import RemoveDiscountButton from "./RemoveDiscountButton";

export default function ProductCard({ produto }) {
  const { name, description, stock, price, finalPrice, discount } = produto;

  const isOutOfStock = stock === 0;
  const hasDiscount = !!discount;
  const isLowStock = stock > 0 && stock <= 10;

  return (
    <div className="border-2 rounded-lg shadow-md p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:shadow-lg transition-shadow flex flex-col gap-3">
      {/* Header com ícone */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📦</span>
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm min-h-[40px]">
        {description || "No description."}
      </p>

      {/* Seção de preço destacada */}
      <div className="bg-white rounded-lg p-3 border-2 border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Preço:</span>
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-sm">
                R$ {price.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-green-600">
                R$ {finalPrice?.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-blue-600">
              R$ {price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-600 text-sm">Estoque:</span>
          <span
            className={`font-semibold ${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {stock} {stock === 1 ? "unidade" : "unidades"}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {isOutOfStock && (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full border border-red-300">
            ✕ Sem estoque
          </span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-300">
            ⚠️ Estoque baixo
          </span>
        )}
        {hasDiscount && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-300">
            🏷️{" "}
            {discount.type === "percent"
              ? `${discount.value}% OFF`
              : `R$ ${discount.value} OFF`}
          </span>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-2 mt-auto">
        <ApplyCouponModal productId={produto.id} />
        {hasDiscount && <RemoveDiscountButton productId={produto.id} />}
      </div>
    </div>
  );
}
