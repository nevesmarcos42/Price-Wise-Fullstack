import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutos, createOrder, getCupons } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Checkout() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cupom, setCupom] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(""); // Limpa erros anteriores
        const [productsRes, couponsRes] = await Promise.all([
          getProdutos({ page: 1, limit: 100 }),
          getCupons(),
        ]);
        setProducts(productsRes.data || []);
        setAvailableCoupons(couponsRes || []);
      } catch (err) {
        console.error("Error loading checkout data:", err);
        const errorMsg =
          err.response?.status === 404
            ? "Backend server not found. Please make sure the server is running on http://localhost:8080"
            : err.message || "Error loading data";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existing = selectedProducts.find((p) => p.productId === productId);
    if (existing) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: product.id,
          name: product.name,
          price: product.discountPrice || product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId)
    );
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveProduct(productId);
      return;
    }
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const subtotal = selectedProducts.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleFinalizarPedido = async () => {
    if (selectedProducts.length === 0) {
      setError("Add at least one product to cart");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        items: selectedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        couponCode: cupom || null,
      };

      await createOrder(orderData);
      setSuccess("Order placed successfully!");
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error placing order. Check the coupon."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🛒 Checkout</h1>

      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              📦 Select Products
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.discountPrice ? (
                        <>
                          <span className="line-through text-gray-400">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <span className="ml-2 text-green-600 font-semibold">
                            R$ {product.discountPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        `R$ ${product.price.toFixed(2)}`
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddProduct(product.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carrinho */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              🛍️ Cart ({selectedProducts.length})
            </h2>
            {selectedProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Empty cart. Add products above.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedProducts.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        R$ {item.price.toFixed(2)} x {item.quantity} = R${" "}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 border px-2 py-1 rounded text-center"
                      />
                      <button
                        onClick={() => handleRemoveProduct(item.productId)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo e Finalização */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">💳 Resumo</h2>

            {/* Cupom */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Cupom de Desconto
              </label>
              <input
                type="text"
                value={cupom}
                onChange={(e) => setCupom(e.target.value.toUpperCase())}
                placeholder="Digite o código"
                className="w-full border px-3 py-2 rounded"
              />
              {availableCoupons.length > 0 && (
                <div className="text-xs text-gray-500">
                  <p className="font-semibold mb-1">Cupons disponíveis:</p>
                  {availableCoupons.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCupom(c.code)}
                      className="block hover:text-blue-600"
                    >
                      • {c.code} (
                      {c.type === "percent"
                        ? `${c.discountValue}%`
                        : `R$ ${c.discountValue}`}
                      )
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-blue-700">
                <span>Total:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleFinalizarPedido}
              disabled={selectedProducts.length === 0 || loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? "Processando..." : "Finalizar Pedido"}
            </button>

            <p className="text-xs text-center text-gray-500">
              O desconto será aplicado automaticamente se o cupom for válido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
