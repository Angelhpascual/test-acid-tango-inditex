import { describe, it, expect, beforeEach } from "vitest";
import { Row } from "../Row";
import { Product } from "../Product";
import { Alignment } from "../../valueObjects/Alignment";

describe("Row", () => {
  let mockProduct: Product;

  beforeEach(() => {
    mockProduct = new Product(
      "test-id",
      "Test Product",
      9.99,
      "Description",
      "image.jpg",
    );
  });

  it("should enforce maximum product limit", () => {
    let row = Row.create({ id: "test-row", alignment: Alignment.CENTER });

    row = row.addProduct(mockProduct);
    row = row.addProduct(
      new Product("id2", "Product 2", 19.99, "Desc", "img.jpg"),
    );
    row = row.addProduct(
      new Product("id3", "Product 3", 29.99, "Desc", "img.jpg"),
    );

    expect(() =>
      row.addProduct(new Product("id4", "Product 4", 39.99, "Desc", "img.jpg")),
    ).toThrow("Cannot add more than 3 products");
  });

  it("should prevent duplicate products", () => {
    let row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    row = row.addProduct(mockProduct);
    expect(() => row.addProduct(mockProduct)).toThrow("Product already exists");
  });

  it("should maintain product order", () => {
    let row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    const product1 = new Product("id1", "Product 1", 19.99, "Desc", "img.jpg");
    const product2 = new Product("id2", "Product 2", 29.99, "Desc", "img.jpg");

    row = row.addProduct(product1);
    row = row.addProduct(product2);

    expect(row.products[0]).toEqual(product1);
    expect(row.products[1]).toEqual(product2);
  });

  it("should validate product data", () => {
    const row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    const invalidProduct = {} as Product;

    expect(() => row.addProduct(invalidProduct)).toThrow(
      "Invalid product data",
    );
  });

  it("should handle product removal correctly", () => {
    let row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    row = row.addProduct(mockProduct);

    const updatedRow = row.removeProduct(mockProduct.id);
    expect(updatedRow.products).toHaveLength(0);
  });

  it("should throw when removing non-existent product", () => {
    let row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    expect(() => row.removeProduct("non-existent")).toThrow(
      "Product not found",
    );
  });

  it("should update alignment correctly", () => {
    const row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    const updatedRow = row.updateAlignment(Alignment.RIGHT);

    expect(updatedRow.alignment).toBe(Alignment.RIGHT);
  });

  it("should validate alignment value", () => {
    const row = Row.create({ id: "test-row", alignment: Alignment.CENTER });

    expect(() => row.updateAlignment("INVALID" as Alignment)).toThrow(
      "Invalid alignment value",
    );
  });

  it("should find product by id", () => {
    const row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    const updatedRow = row.addProduct(mockProduct);

    const found = updatedRow.findProduct(mockProduct.id);
    expect(found).toEqual(mockProduct);
  });

  it("should return null when product not found", () => {
    const row = Row.create({ id: "test-row", alignment: Alignment.CENTER });
    const found = row.findProduct("non-existent");
    expect(found).toBeNull();
  });
});
