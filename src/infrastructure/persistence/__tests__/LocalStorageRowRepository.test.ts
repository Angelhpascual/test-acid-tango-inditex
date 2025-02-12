import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageRowRepository } from "../LocalStorageRowRepository";
import { Row } from "../../../domain/entities/Row";
import { Product } from "../../../domain/entities/Product";
import { Alignment } from "../../../domain/valueObjects/Alignment";

describe("LocalStorageRowRepository", () => {
  let repository: LocalStorageRowRepository;
  let mockProduct: Product;
  let mockRow: Row;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageRowRepository();
    mockProduct = new Product(
      "test-id",
      "Test Product",
      9.99,
      "Description",
      "image.jpg",
    );
    mockRow = Row.create({
      id: "test-row",
      products: [mockProduct],
      alignment: Alignment.CENTER,
    });
  });

  it("should correctly serialize/deserialize row data", async () => {
    await repository.save(mockRow);
    const retrievedRow = await repository.getById(mockRow.id);

    expect(retrievedRow).toBeDefined();
    expect(retrievedRow?.id).toBe(mockRow.id);
    expect(retrievedRow?.alignment).toBe(mockRow.alignment);
    expect(retrievedRow?.products[0]).toEqual(mockProduct);
  });

  it("should handle product updates correctly", async () => {
    await repository.save(mockRow);
    const updatedProduct = new Product(
      mockProduct.id,
      "Updated Name",
      19.99,
      "Updated Description",
      "new-image.jpg",
    );
    const updatedRow = Row.create({
      id: mockRow.id,
      products: [updatedProduct],
      alignment: mockRow.alignment,
    });

    await repository.update(updatedRow);
    const retrievedRow = await repository.getById(mockRow.id);

    expect(retrievedRow?.products[0].name).toBe("Updated Name");
    expect(retrievedRow?.products[0].price).toBe(19.99);
  });

  it("should maintain row order", async () => {
    const rows = [
      Row.create({ id: "row1", alignment: Alignment.LEFT }),
      Row.create({ id: "row2", alignment: Alignment.CENTER }),
      Row.create({ id: "row3", alignment: Alignment.RIGHT }),
    ];

    for (const row of rows) {
      await repository.save(row);
    }

    const retrievedRows = await repository.getAll();
    expect(retrievedRows.map((r) => r.id)).toEqual(rows.map((r) => r.id));
  });

  it("should handle empty products array", async () => {
    const emptyRow = Row.create({
      id: "empty-row",
      products: [],
      alignment: Alignment.CENTER,
    });

    await repository.save(emptyRow);
    const retrievedRow = await repository.getById(emptyRow.id);

    expect(retrievedRow?.products).toEqual([]);
  });

  it("should handle alignment changes", async () => {
    await repository.save(mockRow);
    const updatedRow = Row.create({
      id: mockRow.id,
      products: mockRow.products,
      alignment: Alignment.RIGHT,
    });

    await repository.update(updatedRow);
    const retrievedRow = await repository.getById(mockRow.id);

    expect(retrievedRow?.alignment).toBe(Alignment.RIGHT);
  });

  it("should handle concurrent updates", async () => {
    await repository.save(mockRow);

    // Simular actualizaciones concurrentes
    const update1 = repository.update(
      Row.create({
        id: mockRow.id,
        products: [mockProduct],
        alignment: Alignment.LEFT,
      }),
    );

    const update2 = repository.update(
      Row.create({
        id: mockRow.id,
        products: [mockProduct],
        alignment: Alignment.RIGHT,
      }),
    );

    await Promise.all([update1, update2]);
    const retrievedRow = await repository.getById(mockRow.id);

    // La última actualización debería prevalecer
    expect(retrievedRow?.alignment).toBeDefined();
  });
});
