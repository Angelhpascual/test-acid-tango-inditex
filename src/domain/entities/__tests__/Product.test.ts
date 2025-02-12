import { describe, it, expect } from "vitest";
import { Product } from "../Product";

describe("Product Entity", () => {
  it("should create a product with all required properties", () => {
    const product = new Product(
      "1",
      "Camiseta Básica",
      19.99,
      "Camiseta de algodón 100%",
      "/images/products/basic-tee.jpg",
    );

    expect(product.id).toBe("1");
    expect(product.name).toBe("Camiseta Básica");
    expect(product.price).toBe(19.99);
    expect(product.description).toBe("Camiseta de algodón 100%");
    expect(product.image).toBe("/images/products/basic-tee.jpg");
  });

  it("should validate price is positive", () => {
    expect(() => new Product("1", "Test", -10, "desc", "img")).toThrow(
      "Price must be positive",
    );
  });

  it("should validate required fields", () => {
    expect(() => new Product("", "Test", 10, "desc", "img")).toThrow(
      "ID is required",
    );
  });
});
