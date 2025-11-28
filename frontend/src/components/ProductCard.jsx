import ApplyCouponModal from "./ApplyCouponModal";
import RemoveDiscountButton from "./RemoveDiscountButton";

export default function ProductCard({ produto }) {
  const { name, description, stock, price, finalPrice, discount } = produto;

  const isOutOfStock = stock === 0;
  const hasDiscount = !!discount;

  return (
    <div className="w-1/2 border rounded-lg shadow-sm p-4 bg-white flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600">{description || "Sem descrição."}</p>

      <div className="text-sm text-gray-700">
        <p>🛒 Estoque: {stock}</p>
        <p>💰 Preço: R${price.toFixed(2)}</p>
        {hasDiscount && (
          <p className="text-green-700 font-semibold">
            Com desconto: R${finalPrice?.toFixed(2)}
          </p>
        )}
      </div>

      {/* Badges visuais */}
      <div className="flex gap-2 pt-1">
        {isOutOfStock && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Esgotado
          </span>
        )}
        {hasDiscount && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Desconto{" "}
            {discount.type === "percent"
              ? `${discount.value}%`
              : `- R$${discount.value}`}
          </span>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-3">
        <ApplyCouponModal productId={produto.id} />
        {hasDiscount && <RemoveDiscountButton productId={produto.id} />}
      </div>
    </div>
  );
}
