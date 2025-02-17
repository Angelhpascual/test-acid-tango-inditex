import { describe, it, expect, vi, beforeEach } from "vitest"
import { DashboardViewModel } from "../DashboardViewModel"
import { Row } from "../../../domain/entities/Row"
import { Alignment } from "../../../domain/valueObjects/Alignment"
import { Product } from "../../../domain/entities/Product"
import { IProductRepository } from "../../../application/ports/IProductRepository"
import { IRowRepository } from "../../../application/ports/IRowRepository"

describe("DashboardViewModel", () => {
  const mockRowRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    updateOrder: vi.fn(),
    reset: vi.fn(),
  }

  const mockProductRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    getRandom: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    reset: vi.fn(),
  }

  const viewModel = new DashboardViewModel(
    mockProductRepository as unknown as IProductRepository,
    mockRowRepository as unknown as IRowRepository
  )

  let mockProduct: Product
  let mockRow: Row

  beforeEach(() => {
    mockProduct = new Product(
      "test-id",
      "Test Product",
      9.99,
      "Description",
      "image.jpg"
    )

    mockRow = Row.create({
      id: "test-row",
      products: [mockProduct],
      alignment: Alignment.CENTER,
    })

    mockProductRepository.getAll.mockResolvedValue([])
    mockRowRepository.getAll.mockResolvedValue([mockRow])
  })

  it("should handle row reordering", async () => {
    const rows = [
      Row.create({ id: "row1", alignment: Alignment.LEFT }),
      Row.create({ id: "row2", alignment: Alignment.CENTER }),
      Row.create({ id: "row3", alignment: Alignment.RIGHT }),
    ]

    mockRowRepository.getAll.mockResolvedValue(rows)
    await viewModel.updateRowOrder(["row3", "row1", "row2"])

    expect(mockRowRepository.updateOrder).toHaveBeenCalledWith([
      rows[2],
      rows[0],
      rows[1],
    ])
  })

  it("should handle maximum products per row", async () => {
    const fullRow = Row.create({
      id: "full-row",
      products: [mockProduct, mockProduct, mockProduct],
      alignment: Alignment.CENTER,
    })

    mockRowRepository.getById.mockResolvedValue(fullRow)
    await expect(viewModel.addRandomProductToRow(fullRow.id)).rejects.toThrow()
  })

  it("should handle product removal when row is deleted", async () => {
    const rowWithProducts = Row.create({
      id: "row-to-delete",
      products: [mockProduct],
      alignment: Alignment.CENTER,
    })

    mockRowRepository.getById.mockResolvedValue(rowWithProducts)
    await viewModel.deleteRow(rowWithProducts.id)

    expect(mockRowRepository.delete).toHaveBeenCalledWith(rowWithProducts.id)
  })

  it("should handle errors gracefully", async () => {
    mockRowRepository.getById.mockRejectedValue(new Error("Database error"))

    await expect(
      viewModel.updateRowAlignment("non-existent", Alignment.CENTER)
    ).rejects.toThrow()
  })

  it("should initialize with empty state", async () => {
    mockRowRepository.getAll.mockResolvedValue([])
    mockProductRepository.getAll.mockResolvedValue([])

    const rows = await viewModel.getRows()
    expect(rows).toEqual([])
  })

  it("should handle concurrent row updates", async () => {
    mockRowRepository.getById.mockResolvedValue(mockRow)

    const update1 = viewModel.updateRowAlignment(mockRow.id, Alignment.LEFT)
    const update2 = viewModel.updateRowAlignment(mockRow.id, Alignment.RIGHT)

    await Promise.all([update1, update2])
    expect(mockRowRepository.update).toHaveBeenCalledTimes(2)
  })

  it("should get rows", async () => {
    mockRowRepository.getAll.mockResolvedValue([mockRow])
    const rows = await viewModel.getRows()
    expect(rows).toEqual([mockRow])
  })

  it("should add row", async () => {
    mockRowRepository.getAll.mockResolvedValue([])
    await viewModel.addRow()
    expect(mockRowRepository.save).toHaveBeenCalled()
  })

  it("should move product between rows", async () => {
    const sourceRow = mockRow
    const targetRow = Row.create({
      id: "target-id",
      alignment: Alignment.CENTER,
    })

    mockRowRepository.getById
      .mockResolvedValueOnce(sourceRow)
      .mockResolvedValueOnce(targetRow)
      .mockResolvedValueOnce(sourceRow.removeProduct(mockProduct.id))
      .mockResolvedValueOnce(targetRow.addProduct(mockProduct))

    await viewModel.moveProduct(mockProduct.id, "source-id", "target-id")
    expect(mockRowRepository.update).toHaveBeenCalledTimes(2)
  })

  it("should add a new row", async () => {
    const mockRowRepository = {
      getAll: vi.fn().mockResolvedValue([]),
      save: vi.fn(),
      getById: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      updateOrder: vi.fn(),
      reset: vi.fn(),
    } as unknown as IRowRepository

    const viewModel = new DashboardViewModel(
      mockProductRepository as unknown as IProductRepository,
      mockRowRepository
    )
    await viewModel.addRow()
    expect(mockRowRepository.save).toHaveBeenCalled()
  })
})
