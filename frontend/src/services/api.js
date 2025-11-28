import axios from "axios";

// Base URL configuration
// In development (Vite dev server): use direct backend URL
// In production (Docker with nginx proxy): use relative path
const isDevelopment = import.meta.env.MODE === "development";
const isDockerEnvironment =
  window.location.port === "80" || window.location.port === "";

axios.defaults.baseURL =
  isDevelopment && !isDockerEnvironment
    ? "http://localhost:8080" // Development: direct backend connection
    : ""; // Production/Docker: use nginx proxy

// Request interceptor to add JWT token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export async function login(email, password) {
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(name, email, password) {
  try {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Orders endpoints
export async function getPedidos() {
  try {
    const response = await axios.get("/api/v1/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function createOrder(orderData) {
  try {
    const response = await axios.post("/api/v1/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
}

// Products with filters
export async function getProdutos(params) {
  try {
    const response = await axios.get("/api/v1/products", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const response = await axios.post("/api/v1/products", productData);
    return response.data;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

export async function removeDesconto(productId) {
  return axios.delete(`/api/v1/products/${productId}/discount`);
}

// Coupons
export async function postCupom(data) {
  try {
    const response = await axios.post("/api/v1/coupons", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cupom:", error);
    throw error;
  }
}

export async function getCupons() {
  try {
    const response = await axios.get("/api/v1/coupons");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cupons:", error);
    throw error;
  }
}

export async function applyCoupon(productId, couponCode) {
  try {
    const response = await axios.post("/api/v1/coupons/apply", {
      productId,
      couponCode,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao aplicar cupom:", error);
    throw error;
  }
}

// Cart & checkout
export async function checkout(cartData) {
  try {
    const response = await axios.post("/api/v1/cart/checkout", cartData);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer checkout:", error);
    throw error;
  }
}
