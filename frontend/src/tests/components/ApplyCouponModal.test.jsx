import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ApplyCouponModal from "../../components/ApplyCouponModal";

describe("ApplyCouponModal", () => {
  it("should render modal with title", () => {
    render(<ApplyCouponModal />);

    expect(screen.getByText("Apply Coupon")).toBeInTheDocument();
  });

  it("should render coupon code input", () => {
    render(<ApplyCouponModal />);

    const input = screen.getByPlaceholderText("Coupon code");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("should render apply button", () => {
    render(<ApplyCouponModal />);

    const button = screen.getByRole("button", { name: /apply/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-blue-600");
  });
});
