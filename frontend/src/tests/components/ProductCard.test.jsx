import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    name: "Test Product",
    description: "Test Description",
    stock: 10,
    price: 100.0,
    finalPrice: 90.0,
    discount: null,
  };

  it("should render product information correctly", () => {
    renderWithRouter(<ProductCard produto={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText(/Stock: 10/)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$100\.00/)).toBeInTheDocument();
  });

  it("should show out of stock badge when stock is 0", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithRouter(<ProductCard produto={outOfStockProduct} />);

    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("should show discount information when product has discount", () => {
    const discountedProduct = {
      ...mockProduct,
      discount: {
        type: "percent",
        value: 10,
      },
      finalPrice: 90.0,
    };

    renderWithRouter(<ProductCard produto={discountedProduct} />);

    expect(screen.getByText(/With discount: \$90\.00/)).toBeInTheDocument();
    expect(screen.getByText(/Discount 10%/)).toBeInTheDocument();
  });

  it("should show fixed discount badge correctly", () => {
    const fixedDiscountProduct = {
      ...mockProduct,
      discount: {
        type: "fixed",
        value: 20,
      },
      finalPrice: 80.0,
    };

    renderWithRouter(<ProductCard produto={fixedDiscountProduct} />);

    expect(screen.getByText(/- R\$20/)).toBeInTheDocument();
  });

  it("should show RemoveDiscountButton only when product has discount", () => {
    const { rerender } = renderWithRouter(
      <ProductCard produto={mockProduct} />
    );

    expect(screen.queryByText("Remove Discount")).not.toBeInTheDocument();

    const discountedProduct = {
      ...mockProduct,
      discount: { type: "percent", value: 10 },
    };

    rerender(
      <BrowserRouter>
        <ProductCard produto={discountedProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText("Remove Discount")).toBeInTheDocument();
  });

  it("should render without description", () => {
    const noDescProduct = { ...mockProduct, description: null };
    renderWithRouter(<ProductCard produto={noDescProduct} />);

    expect(screen.getByText("No description.")).toBeInTheDocument();
  });
});
