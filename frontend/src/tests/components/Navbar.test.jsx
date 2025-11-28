import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../components/Navbar";

describe("Navbar", () => {
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it("should render the logo", () => {
    renderNavbar();
    expect(screen.getByText("PriceWise")).toBeInTheDocument();
  });

  it("should render all navigation links", () => {
    renderNavbar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Coupons")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Checkout")).toBeInTheDocument();
  });

  it("should have correct link hrefs", () => {
    renderNavbar();

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    const ordersLink = screen.getByText("Orders").closest("a");
    const couponsLink = screen.getByText("Coupons").closest("a");
    const productsLink = screen.getByText("Products").closest("a");
    const checkoutLink = screen.getByText("Checkout").closest("a");

    expect(dashboardLink).toHaveAttribute("href", "/");
    expect(ordersLink).toHaveAttribute("href", "/orders");
    expect(couponsLink).toHaveAttribute("href", "/cupons");
    expect(productsLink).toHaveAttribute("href", "/produtos");
    expect(checkoutLink).toHaveAttribute("href", "/checkout");
  });

  it("should apply active class to home link by default", () => {
    renderNavbar();

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toHaveClass("border-b-2", "border-white");
  });
});
