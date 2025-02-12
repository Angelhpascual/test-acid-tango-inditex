import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddRandomProductToRowUseCase } from "../AddRandomProductToRowUseCase";
import { IProductRepository } from "../../../ports/IProductRepository";
import { IRowRepository } from "../../../ports/IRowRepository";
import { Product } from "../../../../domain/entities/Product";
import { Row } from "../../../../domain/entities/Row";

describe("AddRandomProductToRowUseCase", () => {
  let mockProductRepository: IProductRepository;
  let mockRowRepository: IRowRepository;
  let useCase: AddRandomProductToRowUseCase;

  const mockProduct = new Product(
    "test-id",
    "Test Product",
    9.99,
    "Description",
    "image.jpg",
  );

  const mockRow = Row.create({
    id: "row-1",
    products: [],
  });

  beforeEach(() => {
    mockProductRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      getRandom: vi.fn().mockResolvedValue(mockProduct),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      reset: vi.fn(),
    };

    mockRowRepository = {
      getAll: vi.fn(),
      getById: vi.fn().mockResolvedValue(mockRow),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      updateOrder: vi.fn(),
      reset: vi.fn(),
    };

    useCase = new AddRandomProductToRowUseCase(
      mockProductRepository,
      mockRowRepository,
    );
  });

  it("should add a random product to row", async () => {
    await useCase.execute("row-1");

    expect(mockProductRepository.getRandom).toHaveBeenCalled();
    expect(mockRowRepository.update).toHaveBeenCalled();
  });

  it("should throw if row is full", async () => {
    const fullRow = Row.create({
      id: "row-1",
      products: [mockProduct, mockProduct, mockProduct],
    });

    mockRowRepository.getById = vi.fn().mockResolvedValue(fullRow);

    await expect(useCase.execute("row-1")).rejects.toThrow(
      "Row cannot have more than 3 products",
    );
  });
});
