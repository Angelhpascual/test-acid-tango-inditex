import { describe, it, expect, vi } from "vitest"
import { AddRowUseCase } from "../AddRowUseCase"
import { IRowRepository } from "../../../ports/IRowRepository"

describe("AddRowUseCase", () => {
  const mockRowRepository = {
    getAll: vi.fn(),
    save: vi.fn(),
    getById: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    updateOrder: vi.fn(),
    reset: vi.fn(),
  } as unknown as IRowRepository

  it("should create and save a new row", async () => {
    const useCase = new AddRowUseCase(mockRowRepository)
    await useCase.execute()
    expect(mockRowRepository.save).toHaveBeenCalled()
  })
})
