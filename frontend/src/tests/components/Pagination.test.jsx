import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../components/Pagination";

describe("Pagination", () => {
  it("should render pagination with correct page info", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("should disable previous button on first page", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);

    const previousButton = screen.getByText("← Previous page");
    expect(previousButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />);

    const nextButton = screen.getByText("Next page →");
    expect(nextButton).toBeDisabled();
  });

  it("should call onPageChange with previous page number", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    const previousButton = screen.getByText("← Previous page");
    fireEvent.click(previousButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange with next page number", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByText("Next page →");
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("should not call onPageChange when clicking disabled previous button", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    const previousButton = screen.getByText("← Previous page");
    fireEvent.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when clicking disabled next button", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByText("Next page →");
    fireEvent.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should render with single page", () => {
    render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />);

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.getByText("← Previous page")).toBeDisabled();
    expect(screen.getByText("Next page →")).toBeDisabled();
  });
});
