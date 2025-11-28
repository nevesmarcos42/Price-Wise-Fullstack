import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OrderCard from "../../components/OrderCard";

describe("OrderCard", () => {
  const mockOrder = {
    orderId: 123,
    productNames: ["Product 1", "Product 2"],
    totalFinal: 150.5,
    couponCode: "PROMO10",
    createdAt: "2025-11-28T10:00:00",
  };

  it("should render order information correctly", () => {
    render(<OrderCard {...mockOrder} />);

    expect(screen.getByText("Order #123")).toBeInTheDocument();
    expect(screen.getByText("Product 1, Product 2")).toBeInTheDocument();
    expect(screen.getByText(/\$ 150\.50/)).toBeInTheDocument();
  });

  it("should render coupon code when provided", () => {
    render(<OrderCard {...mockOrder} />);

    expect(screen.getByText("PROMO10")).toBeInTheDocument();
  });

  it("should not render coupon section when couponCode is not provided", () => {
    const orderWithoutCoupon = { ...mockOrder, couponCode: null };
    render(<OrderCard {...orderWithoutCoupon} />);

    expect(screen.queryByText("🎟️")).not.toBeInTheDocument();
  });

  it("should format date correctly", () => {
    render(<OrderCard {...mockOrder} />);

    expect(screen.getByText(/11\/28\/2025/)).toBeInTheDocument();
  });

  it("should show fallback text when products not informed", () => {
    const orderWithoutProducts = { ...mockOrder, productNames: null };
    render(<OrderCard {...orderWithoutProducts} />);

    expect(screen.getByText("Products not informed")).toBeInTheDocument();
  });

  it("should show fallback text when date is unavailable", () => {
    const orderWithoutDate = { ...mockOrder, createdAt: null };
    render(<OrderCard {...orderWithoutDate} />);

    expect(screen.getByText("Date unavailable")).toBeInTheDocument();
  });

  it("should display order icon", () => {
    render(<OrderCard {...mockOrder} />);

    expect(screen.getByText("📦")).toBeInTheDocument();
  });

  it("should display total value label", () => {
    render(<OrderCard {...mockOrder} />);

    expect(screen.getByText("Total Value:")).toBeInTheDocument();
  });

  it("should handle empty product array", () => {
    const orderWithEmptyProducts = { ...mockOrder, productNames: [] };
    const { container } = render(<OrderCard {...orderWithEmptyProducts} />);

    const productsParagraph = container.querySelector(
      ".text-gray-800.font-medium.line-clamp-2"
    );
    expect(productsParagraph).toBeEmptyDOMElement();
  });
});
