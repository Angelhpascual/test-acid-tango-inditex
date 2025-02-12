import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddProductUseCase } from "../AddProductUseCase";
import { IProductRepository } from "../../../ports/IProductRepository";
import { Product } from "../../../../domain/entities/Product";

describe("AddProductUseCase", () => {
  let mockProductRepository: IProductRepository;
  let useCase: AddProductUseCase;

  const mockProductData = new Product(
    "test-id",
    "Test Product",
    9.99,
    "Test Description",
    "test.jpg",
  );

  beforeEach(() => {
    mockProductRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      getRandom: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      reset: vi.fn(),
    };
    useCase = new AddProductUseCase(mockProductRepository);
  });

  it("should add a product", async () => {
    await useCase.execute(mockProductData);
    expect(mockProductRepository.save).toHaveBeenCalled();
  });
});
