import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoveProductUseCase } from "../RemoveProductUseCase";
import { IRowRepository } from "../../../ports/IRowRepository";
import { Row } from "../../../../domain/entities/Row";
import { Product } from "../../../../domain/entities/Product";

describe("RemoveProductUseCase", () => {
  let mockRowRepository: IRowRepository;
  let useCase: RemoveProductUseCase;

  const mockProduct = new Product(
    "test-id",
    "Test Product",
    9.99,
    "Description",
    "image.jpg",
  );

  beforeEach(() => {
    mockRowRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      updateOrder: vi.fn(),
      reset: vi.fn(),
    };
    useCase = new RemoveProductUseCase(mockRowRepository);
  });

  it("should remove a product from row", async () => {
    const row = Row.create({ products: [mockProduct] });
    vi.mocked(mockRowRepository.getById).mockResolvedValue(row);

    await useCase.execute(row.id, mockProduct.id);
    expect(mockRowRepository.update).toHaveBeenCalled();
  });

  it("should do nothing if row not found", async () => {
    vi.mocked(mockRowRepository.getById).mockResolvedValue(null);
    await useCase.execute("non-existent", "product-id");
    expect(mockRowRepository.update).not.toHaveBeenCalled();
  });
});
