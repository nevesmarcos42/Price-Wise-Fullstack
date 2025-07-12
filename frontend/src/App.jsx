import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Cupons from "./pages/Cupons";
import Orders from "./pages/Orders";
import Produtos from "./pages/Product";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cupons" element={<Cupons />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
