import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "../../components/FilterBar";

describe("FilterBar", () => {
  const mockFilters = {
    search: "",
    minPrice: "",
    maxPrice: "",
    hasDiscount: false,
    page: 1,
  };

  it("should render all filter inputs", () => {
    render(<FilterBar filters={mockFilters} setFilters={vi.fn()} />);

    expect(
      screen.getByPlaceholderText("Search by name...")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Min price")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max price")).toBeInTheDocument();
    expect(screen.getByText("With discount")).toBeInTheDocument();
  });

  it("should display current filter values", () => {
    const filters = {
      search: "Laptop",
      minPrice: "100",
      maxPrice: "500",
      hasDiscount: true,
      page: 1,
    };

    render(<FilterBar filters={filters} setFilters={vi.fn()} />);

    expect(screen.getByDisplayValue("Laptop")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("should call setFilters when search input changes", () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={mockFilters} setFilters={setFilters} />);

    const searchInput = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(searchInput, { target: { value: "Mouse" } });

    expect(setFilters).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should call setFilters when minPrice changes", () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={mockFilters} setFilters={setFilters} />);

    const minPriceInput = screen.getByPlaceholderText("Min price");
    fireEvent.change(minPriceInput, { target: { value: "50" } });

    expect(setFilters).toHaveBeenCalled();
  });

  it("should call setFilters when maxPrice changes", () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={mockFilters} setFilters={setFilters} />);

    const maxPriceInput = screen.getByPlaceholderText("Max price");
    fireEvent.change(maxPriceInput, { target: { value: "1000" } });

    expect(setFilters).toHaveBeenCalled();
  });

  it("should call setFilters when discount checkbox is toggled", () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={mockFilters} setFilters={setFilters} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(setFilters).toHaveBeenCalled();
  });

  it("should reset page to 1 when filters change", () => {
    const setFilters = vi.fn((callback) => {
      const result = callback(mockFilters);
      expect(result.page).toBe(1);
    });

    render(<FilterBar filters={mockFilters} setFilters={setFilters} />);

    const searchInput = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(searchInput, { target: { value: "Test" } });
  });
});
