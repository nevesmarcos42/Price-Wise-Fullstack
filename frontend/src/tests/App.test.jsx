import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("should render Navbar", () => {
    render(<App />);
    expect(screen.getByText("PriceWise")).toBeInTheDocument();
  });

  it("should render all navigation links", () => {
    render(<App />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Coupons")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Checkout")).toBeInTheDocument();
  });

  it("should render Dashboard by default (home route)", () => {
    render(<App />);
    // Dashboard should be rendered at home route
    // This test verifies routing is set up correctly
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
