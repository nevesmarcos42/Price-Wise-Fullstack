import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import LoadingSpinner from "../../components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render with default size", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("div.animate-spin");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-8", "h-8", "border-4");
  });

  it("should render with small size", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector("div.animate-spin");

    expect(spinner).toHaveClass("w-4", "h-4", "border-2");
  });

  it("should render with large size", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector("div.animate-spin");

    expect(spinner).toHaveClass("w-12", "h-12", "border-4");
  });

  it("should have spinning animation", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("div.animate-spin");

    expect(spinner).toHaveClass("animate-spin");
  });
});
