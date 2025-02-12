import { describe, it, expect, vi } from "vitest";
import { RemoveRowUseCase } from "../RemoveRowUseCase";
import { IRowRepository } from "../../../ports/IRowRepository";
import { Row } from "../../../../domain/entities/Row";

describe("RemoveRowUseCase", () => {
  const mockRow = Row.create({ id: "test-id" });

  const mockRowRepository: IRowRepository = {
    getAll: vi.fn().mockResolvedValue([mockRow]),
    getById: vi.fn().mockResolvedValue(mockRow),
    save: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    updateOrder: vi.fn(),
    reset: vi.fn(),
  };

  it("should delete row from repository", async () => {
    const useCase = new RemoveRowUseCase(mockRowRepository);
    await useCase.execute(mockRow.id);
    expect(mockRowRepository.delete).toHaveBeenCalledWith(mockRow.id);
  });

  it("should not throw if row does not exist", async () => {
    const useCase = new RemoveRowUseCase(mockRowRepository);
    await expect(useCase.execute("non-existent-id")).resolves.not.toThrow();
  });
});
