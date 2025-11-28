import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import {
  getPedidos,
  createOrder,
  getProdutos,
  createProduct,
  removeDesconto,
  postCupom,
  getCupons,
  applyCoupon,
  checkout,
} from "../../services/api";

vi.mock("axios");

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Orders API", () => {
    it("should fetch orders successfully", async () => {
      const mockOrders = [{ id: 1, total: 100 }];
      axios.get.mockResolvedValue({ data: mockOrders });

      const result = await getPedidos();

      expect(axios.get).toHaveBeenCalledWith("/api/v1/orders");
      expect(result).toEqual(mockOrders);
    });

    it("should create order successfully", async () => {
      const orderData = { items: [{ productId: 1, quantity: 2 }] };
      const mockResponse = { orderId: 1, total: 200 };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await createOrder(orderData);

      expect(axios.post).toHaveBeenCalledWith("/api/v1/orders", orderData);
      expect(result).toEqual(mockResponse);
    });

    it("should handle orders fetch error", async () => {
      const error = new Error("Network error");
      axios.get.mockRejectedValue(error);

      await expect(getPedidos()).rejects.toThrow("Network error");
    });
  });

  describe("Products API", () => {
    it("should fetch products with filters", async () => {
      const mockProducts = [{ id: 1, name: "Product 1" }];
      const params = { page: 1, size: 10 };
      axios.get.mockResolvedValue({ data: mockProducts });

      const result = await getProdutos(params);

      expect(axios.get).toHaveBeenCalledWith("/api/v1/products", { params });
      expect(result).toEqual(mockProducts);
    });

    it("should create product successfully", async () => {
      const productData = { name: "New Product", price: 100 };
      const mockResponse = { id: 1, ...productData };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await createProduct(productData);

      expect(axios.post).toHaveBeenCalledWith("/api/v1/products", productData);
      expect(result).toEqual(mockResponse);
    });

    it("should remove discount from product", async () => {
      const productId = 1;
      axios.delete.mockResolvedValue({ data: { success: true } });

      await removeDesconto(productId);

      expect(axios.delete).toHaveBeenCalledWith(
        `/api/v1/products/${productId}/discount`
      );
    });
  });

  describe("Coupons API", () => {
    it("should create coupon successfully", async () => {
      const couponData = { code: "PROMO10", value: 10 };
      const mockResponse = { id: 1, ...couponData };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await postCupom(couponData);

      expect(axios.post).toHaveBeenCalledWith("/api/v1/coupons", couponData);
      expect(result).toEqual(mockResponse);
    });

    it("should fetch coupons successfully", async () => {
      const mockCoupons = [{ code: "PROMO10", value: 10 }];
      axios.get.mockResolvedValue({ data: mockCoupons });

      const result = await getCupons();

      expect(axios.get).toHaveBeenCalledWith("/api/v1/coupons");
      expect(result).toEqual(mockCoupons);
    });

    it("should apply coupon to product", async () => {
      const productId = 1;
      const couponCode = "PROMO10";
      const mockResponse = { finalPrice: 90 };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await applyCoupon(productId, couponCode);

      expect(axios.post).toHaveBeenCalledWith("/api/v1/coupons/apply", {
        productId,
        couponCode,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle coupon application error", async () => {
      const error = new Error("Invalid coupon");
      axios.post.mockRejectedValue(error);

      await expect(applyCoupon(1, "INVALID")).rejects.toThrow("Invalid coupon");
    });
  });

  describe("Cart/Checkout API", () => {
    it("should process checkout successfully", async () => {
      const cartData = { items: [{ productId: 1, quantity: 2 }] };
      const mockResponse = { orderId: 1, total: 200 };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await checkout(cartData);

      expect(axios.post).toHaveBeenCalledWith(
        "/api/v1/cart/checkout",
        cartData
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle checkout error", async () => {
      const error = new Error("Checkout failed");
      axios.post.mockRejectedValue(error);

      await expect(checkout({})).rejects.toThrow("Checkout failed");
    });
  });

  describe("Axios configuration", () => {
    it("should have correct base URL", () => {
      expect(axios.defaults.baseURL).toBe("http://localhost:8080");
    });
  });
});
