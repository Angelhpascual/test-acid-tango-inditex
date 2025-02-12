import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageProductRepository } from "../LocalStorageProductRepository";
import { Product } from "../../../domain/entities/Product";
import { initialProducts } from "../../../data/products";

describe("LocalStorageProductRepository", () => {
  let repository: LocalStorageProductRepository;
  let initialProductCount: number;

  beforeEach(async () => {
    localStorage.clear();
    repository = new LocalStorageProductRepository();
    const initialProducts = await repository.getAll();
    initialProductCount = initialProducts.length;
  });

  const createTestProduct = (id: string = "test-id") =>
    new Product(id, "Test Product", 9.99, "Description", "image.jpg");

  it("should initialize with default products", async () => {
    const products = await repository.getAll();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toBeInstanceOf(Product);
  });

  it("should save and retrieve a product", async () => {
    const product = createTestProduct();
    await repository.save(product);
    const retrieved = await repository.getById(product.id);
    expect(retrieved).toEqual(product);
  });

  it("should update an existing product", async () => {
    const product = new Product("1", "Test", 9.99, "Desc", "img.jpg");
    await repository.save(product);

    const updatedProduct = new Product(
      "1",
      "Test",
      19.99,
      "New Desc",
      "new.jpg",
    );
    await repository.update(updatedProduct);

    const retrieved = await repository.getById("1");
    expect(retrieved?.price).toBe(19.99);
  });

  it("should delete a product", async () => {
    const product = new Product("1", "Test", 9.99, "Desc", "img.jpg");
    await repository.save(product);
    await repository.delete(product.id);

    const retrieved = await repository.getById("1");
    expect(retrieved).toBeNull();
  });

  it("should reset to initial products", async () => {
    // Primero guardamos algunos productos adicionales
    const extraProduct = new Product(
      "extra",
      "Extra",
      29.99,
      "Extra desc",
      "extra.jpg",
    );
    await repository.save(extraProduct);

    // Luego reseteamos
    await repository.reset();
    const products = await repository.getAll();

    // Verificar que tenemos el número correcto de productos iniciales
    expect(products.length).toBe(initialProducts.length);

    // Verificar que los productos son los iniciales
    expect(products).toEqual(expect.arrayContaining(initialProducts));
  });

  // Nuevos tests
  it("should handle multiple products", async () => {
    const product1 = createTestProduct("1");
    const product2 = createTestProduct("2");

    await repository.save(product1);
    await repository.save(product2);

    const products = await repository.getAll();
    expect(products).toContainEqual(product1);
    expect(products).toContainEqual(product2);
  });

  it("should return null for non-existent product", async () => {
    const product = await repository.getById("non-existent");
    expect(product).toBeNull();
  });

  it("should preserve product order after updates", async () => {
    const product1 = createTestProduct("1");
    const product2 = createTestProduct("2");

    await repository.save(product1);
    await repository.save(product2);

    const updatedProduct1 = product1.update({ price: 29.99 });
    await repository.save(updatedProduct1);

    const products = await repository.getAll();
    const ids = products.map((p) => p.id);
    expect(ids.indexOf(product1.id)).toBeLessThan(ids.indexOf(product2.id));
  });

  it("should maintain product instances after getAll", async () => {
    const products = await repository.getAll();
    const sameProducts = await repository.getAll();
    expect(products).toEqual(sameProducts);
  });
});
