import { useEffect, useState } from "react";
import { getCupons } from "../services/api";
import CouponCard from "../components/CouponCard";
import CouponForm from "../components/CouponForm";

export default function Cupons() {
  const [cupons, setCupons] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCupons();
        console.log("Retorno cupons:", response.data); // 🔎 Verifica estrutura
        setCupons(response.data);
      } catch (error) {
        console.error("Erro ao buscar cupons:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">🎟️ Cupons</h1>

      <CouponForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cupons.length === 0 ? (
          <p className="text-gray-500 col-span-3">Nenhum cupom cadastrado.</p>
        ) : (
          cupons.map((cupom) => <CouponCard key={cupom.id} cupom={cupom} />)
        )}
      </div>
    </div>
  );
}
