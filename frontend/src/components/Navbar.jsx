import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-white text-2xl font-bold tracking-wide">
            PriceWise
          </h1>

          <div className="flex space-x-16 text-white font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-blue-200 transition"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-blue-200 transition"
              }
            >
              Pedidos
            </NavLink>
            <NavLink
              to="/cupons"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-blue-200 transition"
              }
            >
              Cupons
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
