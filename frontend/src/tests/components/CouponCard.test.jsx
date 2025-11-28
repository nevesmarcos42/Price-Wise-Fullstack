import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CouponCard from "../../components/CouponCard";

describe("CouponCard", () => {
  const mockCoupon = {
    code: "PROMO10",
    type: "percent",
    discountValue: 10,
    oneShot: false,
    validFrom: "2025-01-01T00:00:00",
    validUntil: "2025-12-31T23:59:59",
  };

  it("should render coupon information correctly", () => {
    render(<CouponCard cupom={mockCoupon} />);

    expect(screen.getByText("PROMO10")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("Percentual")).toBeInTheDocument();
  });

  it("should show percent discount type", () => {
    render(<CouponCard cupom={mockCoupon} />);

    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("discount")).toBeInTheDocument();
  });

  it("should show fixed discount type", () => {
    const fixedCoupon = {
      ...mockCoupon,
      type: "fixed",
      discountValue: 50,
    };

    render(<CouponCard cupom={fixedCoupon} />);

    expect(screen.getByText(/R\$ 50\.00/)).toBeInTheDocument();
    expect(screen.getByText("OFF")).toBeInTheDocument();
    expect(screen.getByText("Valor Fixo")).toBeInTheDocument();
  });

  it("should show one-shot status correctly", () => {
    const { rerender } = render(<CouponCard cupom={mockCoupon} />);

    expect(screen.getByText("✕ Não")).toBeInTheDocument();

    const oneShotCoupon = { ...mockCoupon, oneShot: true };
    rerender(<CouponCard cupom={oneShotCoupon} />);

    expect(screen.getByText("✓ Sim")).toBeInTheDocument();
  });

  it("should show active status for valid coupon", () => {
    render(<CouponCard cupom={mockCoupon} />);

    expect(screen.getByText("✓ Active")).toBeInTheDocument();
  });

  it("should show expired status for expired coupon", () => {
    const expiredCoupon = {
      ...mockCoupon,
      validUntil: "2020-01-01T00:00:00",
    };

    render(<CouponCard cupom={expiredCoupon} />);

    expect(screen.getByText("✕ Expired")).toBeInTheDocument();
  });

  it("should show expiring soon warning", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiringCoupon = {
      ...mockCoupon,
      validUntil: tomorrow.toISOString(),
    };

    render(<CouponCard cupom={expiringCoupon} />);

    expect(screen.getByText("⚠️ Expiring soon")).toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    render(<CouponCard cupom={mockCoupon} />);

    // Verifica se as datas são exibidas
    expect(screen.getByText(/De:/)).toBeInTheDocument();
    expect(screen.getByText(/Até:/)).toBeInTheDocument();
  });
});
