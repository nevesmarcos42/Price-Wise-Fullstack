import { useState } from "react";

export default function Checkout() {
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const produtos = [
    { id: 1, name: "Café Nacional", price: 15.9, quantity: 2 },
    { id: 2, name: "Filtro Reutilizável", price: 8.5, quantity: 1 },
  ];

  const subtotal = produtos.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalFinal = subtotal - desconto;

  const aplicarCupom = () => {
    // Simulação: aplicar R$5 de desconto se cupom for "PROMO5"
    if (cupom.toLowerCase() === "promo5") {
      setDesconto(5);
    } else {
      setDesconto(0);
      alert("Cupom inválido.");
    }
  };

  return (
    <div className="w-1/4 p-6 space-y-6  mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-blue-700">🛒 Checkout</h1>

      <ul className="space-y-2">
        {produtos.map((item) => (
          <li key={item.id} className="border p-3 rounded flex justify-between">
            <span>
              {item.quantity} - {item.name}
            </span>
            <span>R${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            placeholder="Digite o código do cupom"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={aplicarCupom}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aplicar
          </button>
        </div>

        <div className="text-sm text-gray-700">
          <p>Subtotal: R${subtotal.toFixed(2)}</p>
          <p>Desconto: R${desconto.toFixed(2)}</p>
          <p className="font-semibold text-lg">
            Total Final: R${totalFinal.toFixed(2)}
          </p>
        </div>
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Finalizar Pedido
      </button>
    </div>
  );
}
