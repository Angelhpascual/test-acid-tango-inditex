/**
 * Tests for ProductCard component
 *
 * These tests cover:
 * - Basic rendering of product information
 * - User interactions (remove button)
 * - Styling and layout behavior
 * - Text truncation and formatting
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "../product/ProductCard";
import { Product } from "../../../domain/entities/Product";

describe("ProductCard Component", () => {
  const mockProduct = new Product(
    "test-id",
    "Camiseta Negra",
    19.99,
    "Camiseta de algodón 100%, diseño minimalista.",
    "/images/products/Shirt.webp",
  );

  const mockHandleRemove = vi.fn();

  beforeEach(() => {
    mockHandleRemove.mockClear();
  });

  describe("basic rendering", () => {
    it("should render product information correctly", () => {
      render(
        <ProductCard
          product={mockProduct}
          onRemove={mockHandleRemove}
          isDragging={false}
          rowId="test-row-id"
        />,
      );

      expect(screen.getByText("Camiseta Negra")).toBeInTheDocument();
      expect(screen.getByText("$19.99")).toBeInTheDocument();
      expect(screen.getByAltText("Camiseta Negra")).toHaveAttribute(
        "src",
        "/images/products/Shirt.webp",
      );
    });

    it("should format large prices correctly", () => {
      const expensiveProduct = new Product(
        "test-id",
        "Test Product",
        1234567.89,
        "Description test",
        "/images/products/test.jpg",
      );
      render(
        <ProductCard
          product={expensiveProduct}
          onRemove={mockHandleRemove}
          isDragging={false}
          rowId="test-row-id"
        />,
      );
      expect(screen.getByText("$1234567.89")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("should call onRemove with product id when remove button is clicked", () => {
      render(
        <ProductCard
          product={mockProduct}
          onRemove={() => mockHandleRemove(mockProduct.id)}
          isDragging={false}
          rowId="test-row-id"
        />,
      );

      const removeButton = screen.getByRole("button", {
        name: /remove product/i,
      });
      fireEvent.click(removeButton);
      expect(mockHandleRemove).toHaveBeenCalledWith(mockProduct.id);
    });

    it("should not show remove button when onRemove is not provided", () => {
      render(
        <ProductCard
          product={mockProduct}
          isDragging={false}
          rowId="test-row-id"
        />,
      );
      const removeButton = screen.queryByRole("button", {
        name: /remove product/i,
      });
      expect(removeButton).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should apply dragging styles when isDragging is true", () => {
      const { container } = render(
        <ProductCard
          product={mockProduct}
          onRemove={mockHandleRemove}
          isDragging={true}
          rowId="test-row-id"
        />,
      );

      const motionDiv = container.querySelector(".motion-div");
      expect(motionDiv).toHaveClass("opacity-50");
    });

    it("should apply hover styles", () => {
      const { container } = render(
        <ProductCard
          product={mockProduct}
          onRemove={mockHandleRemove}
          isDragging={false}
          rowId="test-row-id"
        />,
      );
      const card = container.querySelector(".motion-div");
      expect(card).toHaveClass("hover:shadow-lg");
    });

    it("should apply grab cursor styles", () => {
      const { container } = render(
        <ProductCard
          product={mockProduct}
          onRemove={mockHandleRemove}
          isDragging={false}
          rowId="test-row-id"
        />,
      );
      const card = container.querySelector(".motion-div");
      expect(card).toHaveClass("cursor-grab");
      expect(card).toHaveClass("active:cursor-grabbing");
    });
  });

  describe("text handling", () => {
    it("should handle long product names", () => {
      const longNameProduct = new Product(
        "test-id",
        "A Very Very Very Very Long Product Name That Should Be Truncated",
        19.99,
        "Description test",
        "/images/products/test.jpg",
      );
      render(
        <ProductCard
          product={longNameProduct}
          onRemove={mockHandleRemove}
          isDragging={false}
          rowId="test-row-id"
        />,
      );
      const nameElement = screen.getByText(longNameProduct.name);
      expect(nameElement).toHaveClass("truncate");
    });

    it("should handle long descriptions", () => {
      const longDescProduct = new Product(
        "test-id",
        "Test Product",
        19.99,
        "A very long description that should be clamped to two lines of text. This is a really long description that should definitely overflow.",
        "/images/products/test.jpg",
      );
      render(
        <ProductCard
          product={longDescProduct}
          onRemove={mockHandleRemove}
          isDragging={false}
          rowId="test-row-id"
        />,
      );
      const descElement = screen.getByText(longDescProduct.description);
      expect(descElement).toHaveClass("line-clamp-2");
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      render(
        <ProductCard
          product={mockProduct}
          onRemove={mockHandleRemove}
          isDragging={false}
          rowId="test-row-id"
        />,
      );

      const removeButton = screen.getByRole("button", {
        name: /remove product/i,
      });
      expect(removeButton).toHaveAttribute("aria-label", "Remove product");

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt", mockProduct.name);
    });
  });
});
