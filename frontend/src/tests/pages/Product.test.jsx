import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Products from "../../pages/Product";
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

describe("Products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render page title", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    expect(screen.getByText("🛍️ Available Products")).toBeInTheDocument();
  });

  it("should render add product button", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    const addButton = screen.getByText("➕ Add Product");
    expect(addButton).toBeInTheDocument();
  });

  it("should navigate to add-product page when button clicked", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    const addButton = screen.getByText("➕ Add Product");
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/add-product");
  });

  it("should render FilterBar component", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search by name...")
      ).toBeInTheDocument();
    });
  });

  it("should render Pagination component", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 5,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
    });
  });

  it("should display loading spinner while fetching", () => {
    api.getProdutos.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should display products after fetching", async () => {
    api.getProdutos.mockResolvedValue({
      data: [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
      ],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });

  it("should show no products message when empty", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No products found.")).toBeInTheDocument();
    });
  });

  it("should call getProdutos with correct initial filters", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getProdutos).toHaveBeenCalledWith({
        search: "",
        minPrice: "",
        maxPrice: "",
        hasDiscount: false,
        page: 1,
        limit: 9,
      });
    });
  });

  it("should refetch products when filters change", async () => {
    api.getProdutos.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getProdutos).toHaveBeenCalledTimes(1);
    });

    const searchInput = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(searchInput, { target: { value: "Laptop" } });

    await waitFor(() => {
      expect(api.getProdutos).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle API error gracefully", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    api.getProdutos.mockRejectedValue(new Error("Network error"));

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
