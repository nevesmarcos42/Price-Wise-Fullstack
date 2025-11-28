import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Main navigation component
export default function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Debug: log authentication state (remove in production)
  console.log(
    "Navbar - isAuthenticated:",
    isAuthenticated,
    "user:",
    user,
    "loading:",
    loading
  );

  return (
    <nav className="bg-blue-700 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-white text-2xl font-bold tracking-wide">
            PriceWise
          </h1>

          <div className="flex items-center space-x-6 text-white font-medium">
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
              Orders
            </NavLink>

            <NavLink
              to="/cupons"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-blue-200 transition"
              }
            >
              Coupons
            </NavLink>

            <NavLink
              to="/produtos"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-blue-200 transition"
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/checkout"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-blue-200 transition"
              }
            >
              Checkout
            </NavLink>

            {/* Auth Section */}
            <div className="ml-4 pl-4 border-l border-blue-500 flex items-center min-w-[120px]">
              {loading ? (
                <span className="text-sm text-blue-200">Loading...</span>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold">
                    {user?.name} {user?.role === "ADMIN" && "👑"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded transition duration-200 inline-block"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
