import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import * as api from "../../services/api";

vi.mock("../../services/api");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading spinner initially", () => {
    api.getProdutos.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render dashboard title and welcome message", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      total: 0,
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("🏪 Dashboard - Price Wise")).toBeInTheDocument();
      expect(
        screen.getByText("Welcome to the product and order management system")
      ).toBeInTheDocument();
    });
  });

  it("should render statistics cards", async () => {
    api.getProdutos.mockResolvedValue({
      data: [
        { id: 1, name: "Product 1", price: 100, discountPrice: 90 },
        { id: 2, name: "Product 2", price: 100 },
      ],
      total: 10,
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Total Products")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("With Discount")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Active ✓")).toBeInTheDocument();
  });

  it("should render quick action buttons", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      total: 0,
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("View Products")).toBeInTheDocument();
      expect(screen.getByText("Place Order")).toBeInTheDocument();
      expect(screen.getByText("Coupons")).toBeInTheDocument();
      expect(screen.getByText("Orders")).toBeInTheDocument();
    });
  });

  it("should render featured products section", async () => {
    api.getProdutos.mockResolvedValue({
      data: [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
      ],
      total: 2,
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("🌟 Featured Products")).toBeInTheDocument();
    });
  });

  it("should show no products message when empty", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      total: 0,
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No products registered yet.")
      ).toBeInTheDocument();
    });
  });

  it("should handle API error gracefully", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    api.getProdutos.mockRejectedValue(new Error("Network error"));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("should call getProdutos with correct params on mount", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      total: 0,
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getProdutos).toHaveBeenCalledWith({ page: 1, limit: 6 });
    });
  });
});
