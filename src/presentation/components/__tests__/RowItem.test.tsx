import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RowItem } from "../row/RowItem";
import { Row } from "../../../domain/entities/Row";
import { Product } from "../../../domain/entities/Product";
import { Alignment } from "../../../domain/valueObjects/Alignment";

describe("RowItem", () => {
  const mockProduct = new Product(
    "test-id",
    "Test Product",
    9.99,
    "Description",
    "image.jpg",
  );

  const mockProps = {
    row: Row.create({
      id: "row-1",
      products: [mockProduct],
      alignment: Alignment.CENTER,
    }),
    onAlignmentChange: vi.fn(),
    onAddProduct: vi.fn(),
    onRemoveProduct: vi.fn(),
  };

  it("should render add product button when row is not full", () => {
    render(<RowItem {...mockProps} />);
    const addButton = screen.getByText(/add product/i);
    expect(addButton).toBeInTheDocument();
  });

  it("should not show add button when row is full", () => {
    const fullRow = Row.create({
      id: "row-1",
      products: [mockProduct, mockProduct, mockProduct],
      alignment: Alignment.CENTER,
    });
    render(<RowItem {...mockProps} row={fullRow} />);
    const addButton = screen.queryByText(/add product/i);
    expect(addButton).not.toBeInTheDocument();
  });

  it("should call onAlignmentChange when alignment is changed", () => {
    render(<RowItem {...mockProps} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: Alignment.RIGHT } });
    expect(mockProps.onAlignmentChange).toHaveBeenCalledWith(
      mockProps.row.id,
      Alignment.RIGHT,
    );
  });

  it("should call onAddProduct when add button is clicked", () => {
    render(<RowItem {...mockProps} />);
    const addButton = screen.getByText(/add product/i);
    fireEvent.click(addButton);
    expect(mockProps.onAddProduct).toHaveBeenCalledWith(mockProps.row.id);
  });

  it("should call onRemoveProduct when remove button is clicked", () => {
    render(<RowItem {...mockProps} />);
    const removeButton = screen.getByRole("button", {
      name: /remove product/i,
    });
    fireEvent.click(removeButton);
    expect(mockProps.onRemoveProduct).toHaveBeenCalledWith(
      mockProps.row.id,
      mockProduct.id,
    );
  });
});
