import axios from "axios";

/* Pedidos */
export async function getPedidos() {
  try {
    const response = await axios.get("/api/v1/orders");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }
}

/* Produtos com filtros */
export async function getProdutos(params) {
  try {
    const response = await axios.get("/api/v1/products", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

export async function removeDesconto(productId) {
  return axios.delete(`/api/v1/products/${productId}/discount`);
}

/* Cupons */
export async function postCupom(data) {
  return axios.post("/api/v1/coupons", data);
}

export async function getCupons() {
  return axios.get("/api/v1/coupons");
}
