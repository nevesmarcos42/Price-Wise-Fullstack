import { useEffect, useState } from "react";
import { getCupons } from "../services/api";
import CouponCard from "../components/CouponCard";
import CouponForm from "../components/CouponForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Cupons() {
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchCupons = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCupons();
      setCupons(response || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError("Error loading coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCupons();
  }, []);

  const handleCouponCreated = () => {
    setShowForm(false);
    fetchCupons();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            🎟️ Discount Coupons
          </h1>
          <p className="text-gray-600 mt-2">Manage promotional coupons</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showForm ? "✕ Cancel" : "➕ New Coupon"}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Create New Coupon
          </h2>
          <CouponForm onSuccess={handleCouponCreated} />
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Coupons</p>
              <p className="text-3xl font-bold mt-2">{cupons.length}</p>
            </div>
            <div className="text-5xl opacity-20">🎟️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Coupons</p>
              <p className="text-3xl font-bold mt-2">
                {
                  cupons.filter((c) => new Date(c.validUntil) > new Date())
                    .length
                }
              </p>
            </div>
            <div className="text-5xl opacity-20">✓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Expired Coupons</p>
              <p className="text-3xl font-bold mt-2">
                {
                  cupons.filter((c) => new Date(c.validUntil) <= new Date())
                    .length
                }
              </p>
            </div>
            <div className="text-5xl opacity-20">⏰</div>
          </div>
        </div>
      </div>

      {/* Lista de Cupons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Registered Coupons
        </h2>

        {cupons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <p className="text-gray-500 text-lg">No coupons registered</p>
            <p className="text-gray-400 text-sm mt-2">
              Click on "New Coupon" to create your first promotional coupon
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cupons.map((cupom) => (
                <CouponCard key={cupom.id} cupom={cupom} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
