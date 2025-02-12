import { describe, it, expect, vi, beforeEach } from "vitest";
import { MoveProductUseCase } from "../MoveProductUseCase";
import { IRowRepository } from "../../../ports/IRowRepository";
import { Row } from "../../../../domain/entities/Row";
import { Product } from "../../../../domain/entities/Product";
import { Alignment } from "../../../../domain/valueObjects/Alignment";

describe("MoveProductUseCase", () => {
  let moveProductUseCase: MoveProductUseCase;
  let mockRowRepository: IRowRepository & {
    getById: ReturnType<typeof vi.fn>;
  };
  let mockProduct: Product;
  let sourceRow: Row;
  let targetRow: Row;

  beforeEach(() => {
    mockProduct = new Product(
      "test-id",
      "Test Product",
      9.99,
      "Description",
      "image.jpg",
    );

    sourceRow = Row.create({
      id: "source-row",
      products: [mockProduct],
      alignment: Alignment.CENTER,
    });

    targetRow = Row.create({
      id: "target-row",
      products: [],
      alignment: Alignment.CENTER,
    });

    mockRowRepository = {
      getAll: vi.fn(),
      getById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      updateOrder: vi.fn(),
      reset: vi.fn(),
    };

    moveProductUseCase = new MoveProductUseCase(mockRowRepository);
  });

  it("should move product successfully", async () => {
    mockRowRepository.getById
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(targetRow)
      .mockResolvedValueOnce(sourceRow.removeProduct(mockProduct.id))
      .mockResolvedValueOnce(targetRow.addProduct(mockProduct));

    await moveProductUseCase.execute(
      mockProduct.id,
      sourceRow.id,
      targetRow.id,
    );

    expect(mockRowRepository.update).toHaveBeenCalledTimes(2);
  });

  it("should throw when source row not found", async () => {
    mockRowRepository.getById.mockResolvedValueOnce(null);

    await expect(
      moveProductUseCase.execute(mockProduct.id, "invalid-id", targetRow.id),
    ).rejects.toThrow("Source row not found");
  });

  it("should throw when target row not found", async () => {
    mockRowRepository.getById
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(null);

    await expect(
      moveProductUseCase.execute(mockProduct.id, sourceRow.id, "invalid-id"),
    ).rejects.toThrow("Target row not found");
  });

  it("should throw when product not found in source row", async () => {
    mockRowRepository.getById
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(targetRow);

    await expect(
      moveProductUseCase.execute("invalid-product", sourceRow.id, targetRow.id),
    ).rejects.toThrow("Product not found");
  });

  it("should throw when target row is full", async () => {
    const fullTargetRow = Row.create({
      id: "target-row",
      products: [mockProduct, mockProduct, mockProduct],
      alignment: Alignment.CENTER,
    });

    mockRowRepository.getById
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(fullTargetRow);

    await expect(
      moveProductUseCase.execute(
        mockProduct.id,
        sourceRow.id,
        fullTargetRow.id,
      ),
    ).rejects.toThrow("Target row is full");
  });

  it("should throw if product was not removed from source", async () => {
    mockRowRepository.getById
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(targetRow)
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(targetRow.addProduct(mockProduct));

    await expect(
      moveProductUseCase.execute(mockProduct.id, sourceRow.id, targetRow.id),
    ).rejects.toThrow("Product was not removed from source row");
  });

  it("should throw if product was not added to target", async () => {
    mockRowRepository.getById
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(targetRow)
      .mockResolvedValueOnce(sourceRow.removeProduct(mockProduct.id))
      .mockResolvedValueOnce(targetRow);

    await expect(
      moveProductUseCase.execute(mockProduct.id, sourceRow.id, targetRow.id),
    ).rejects.toThrow("Product was not added to target row");
  });
});
