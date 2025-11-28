import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RemoveDiscountButton from "../../components/RemoveDiscountButton";
import * as api from "../../services/api";

vi.mock("../../services/api");

describe("RemoveDiscountButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render remove discount button", () => {
    render(<RemoveDiscountButton productId={1} />);

    expect(screen.getByText("Remove Discount")).toBeInTheDocument();
  });

  it("should call removeDesconto API on click", async () => {
    api.removeDesconto.mockResolvedValue({});

    render(<RemoveDiscountButton productId={123} />);

    const button = screen.getByText("Remove Discount");
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.removeDesconto).toHaveBeenCalledWith(123);
    });
  });

  it("should show success feedback after removal", async () => {
    api.removeDesconto.mockResolvedValue({});

    render(<RemoveDiscountButton productId={1} />);

    const button = screen.getByText("Remove Discount");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Discount removed successfully.")
      ).toBeInTheDocument();
    });
  });

  it("should show error feedback on API failure", async () => {
    api.removeDesconto.mockRejectedValue({
      response: { data: { message: "Product not found" } },
    });

    render(<RemoveDiscountButton productId={999} />);

    const button = screen.getByText("Remove Discount");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Product not found")).toBeInTheDocument();
    });
  });

  it("should show generic error message when no specific error", async () => {
    api.removeDesconto.mockRejectedValue(new Error("Network error"));

    render(<RemoveDiscountButton productId={1} />);

    const button = screen.getByText("Remove Discount");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Error removing discount.")).toBeInTheDocument();
    });
  });

  it("should disable button while loading", async () => {
    api.removeDesconto.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<RemoveDiscountButton productId={1} />);

    const button = screen.getByText("Remove Discount");
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
