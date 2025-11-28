import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorMessage from "../../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("should render default error message", () => {
    render(<ErrorMessage />);

    expect(screen.getByText("Error loading data")).toBeInTheDocument();
    expect(
      screen.getByText(/An unexpected error occurred/)
    ).toBeInTheDocument();
  });

  it("should render custom error message", () => {
    render(<ErrorMessage message="Custom error occurred" />);

    expect(screen.getByText("Custom error occurred")).toBeInTheDocument();
  });

  it("should show retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage onRetry={onRetry} />);

    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("should not show retry button when onRetry is not provided", () => {
    render(<ErrorMessage />);

    expect(screen.queryByText("Try again")).not.toBeInTheDocument();
  });

  it("should call onRetry when retry button is clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage onRetry={onRetry} />);

    const retryButton = screen.getByText("Try again");
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should display error icon", () => {
    const { container } = render(<ErrorMessage />);
    const icon = container.querySelector("svg");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("text-red-400");
  });
});
