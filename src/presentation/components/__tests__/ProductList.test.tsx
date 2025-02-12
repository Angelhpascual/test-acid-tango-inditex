import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductList } from "../product/ProductList";
import { Product } from "../../../domain/entities/Product";
import { Alignment } from "../../../domain/valueObjects/Alignment";

describe("ProductList", () => {
  const mockProducts = [
    new Product("1", "Product 1", 9.99, "Description 1", "image1.jpg"),
    new Product("2", "Product 2", 19.99, "Description 2", "image2.jpg"),
  ];

  const mockProps = {
    products: mockProducts,
    alignment: Alignment.CENTER,
    rowId: "row-1",
    onRemoveProduct: vi.fn(),
  };

  it("should render all products", () => {
    render(<ProductList {...mockProps} />);
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should apply correct alignment class", () => {
    const { container } = render(
      <ProductList {...mockProps} alignment={Alignment.RIGHT} />,
    );
    const productContainer = container.querySelector(".justify-end");
    expect(productContainer).toBeInTheDocument();
  });

  it("should render empty list when no products", () => {
    const { container } = render(<ProductList {...mockProps} products={[]} />);
    const productElements = container.querySelectorAll(".product-card");
    expect(productElements.length).toBe(0);
  });
});
