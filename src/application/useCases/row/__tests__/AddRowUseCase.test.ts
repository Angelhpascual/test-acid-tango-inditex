import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddRowUseCase } from "../AddRowUseCase";
import { IRowRepository } from "../../../ports/IRowRepository";
import { Row } from "../../../../domain/entities/Row";

describe("AddRowUseCase", () => {
  let mockRowRepository: IRowRepository;
  let useCase: AddRowUseCase;

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
    useCase = new AddRowUseCase(mockRowRepository);
  });

  it("should add a row when less than 3 rows exist", async () => {
    vi.mocked(mockRowRepository.getAll).mockResolvedValue([]);
    await useCase.execute();
    expect(mockRowRepository.save).toHaveBeenCalled();
  });

  it("should throw error when trying to add more than 3 rows", async () => {
    const existingRows = [Row.create({}), Row.create({}), Row.create({})];
    vi.mocked(mockRowRepository.getAll).mockResolvedValue(existingRows);

    await expect(useCase.execute()).rejects.toThrow(
      "Cannot add more than 3 rows",
    );
  });
});
