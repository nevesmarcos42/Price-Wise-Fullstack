import axios from "axios";

// Base URL configuration - use relative path for Docker/nginx proxy
axios.defaults.baseURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "" // Use nginx proxy when running in Docker
    : "http://localhost:8080"; // Fallback for local development

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
