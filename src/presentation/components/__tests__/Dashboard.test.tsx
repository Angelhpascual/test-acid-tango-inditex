import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Dashboard } from "../dashboard/Dashboard"
import { Row } from "../../../domain/entities/Row"
import { Product } from "../../../domain/entities/Product"
import { Alignment } from "../../../domain/valueObjects/Alignment"
import { DashboardViewModel } from "../../viewModels/DashboardViewModel"
import { IProductRepository } from "../../../application/ports/IProductRepository"
import { IRowRepository } from "../../../application/ports/IRowRepository"

describe("Dashboard", () => {
  const mockProduct = new Product(
    "product-1",
    "Test Product",
    9.99,
    "Description",
    "image.jpg"
  )

  const mockRow = Row.create({
    id: "row-1",
    products: [mockProduct],
    alignment: Alignment.CENTER,
  })

  const mockViewModel = {
    getRows: vi.fn().mockResolvedValue([mockRow]),
    addRow: vi.fn(),
    removeRow: vi.fn(),
    addRandomProductToRow: vi.fn(),
    removeProduct: vi.fn(),
    updateRowAlignment: vi.fn(),
    moveProduct: vi.fn(),
    resetAll: vi.fn(),
  } as unknown as DashboardViewModel & {
    getRows: ReturnType<typeof vi.fn>
  }

  const createMockRepositories = () => {
    const mockProductRepo = {
      getAll: vi.fn().mockResolvedValue([]),
      getById: vi.fn(),
      getRandom: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      reset: vi.fn(),
    } as unknown as IProductRepository

    const mockRowRepo = {
      getAll: vi.fn().mockResolvedValue([]),
      getById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      updateOrder: vi.fn(),
      reset: vi.fn(),
    } as unknown as IRowRepository

    return { mockProductRepo, mockRowRepo }
  }

  it("should render rows from viewModel", async () => {
    render(<Dashboard viewModel={mockViewModel} />)
    expect(await screen.findByText(mockProduct.name)).toBeInTheDocument()
  })

  it("should call addRow when add row button is clicked", async () => {
    render(<Dashboard viewModel={mockViewModel} />)
    const addButton = await screen.findByText(/add row/i)
    fireEvent.click(addButton)
    expect(mockViewModel.addRow).toHaveBeenCalled()
  })

  it("should allow adding more than 3 rows", async () => {
    const { mockProductRepo, mockRowRepo } = createMockRepositories()
    const viewModel = {
      ...mockViewModel,
      addRow: vi.fn(),
      getRows: vi.fn().mockResolvedValue([]),
    }

    render(<Dashboard viewModel={viewModel} />)

    // Simular añadir 4 filas
    const addButton = screen.getByText(/add row/i)
    for (let i = 0; i < 4; i++) {
      fireEvent.click(addButton)
    }

    // Verificar que se llamó 4 veces sin error
    expect(viewModel.addRow).toHaveBeenCalledTimes(4)
  })

  it("should call resetAll when reset button is clicked", async () => {
    const { mockProductRepo, mockRowRepo } = createMockRepositories()
    const viewModel = new DashboardViewModel(mockProductRepo, mockRowRepo)
    render(<Dashboard viewModel={viewModel} />)
    const resetButton = await screen.findByText(/reset all/i)
    fireEvent.click(resetButton)
    expect(mockProductRepo.reset).toHaveBeenCalled()
    expect(mockRowRepo.reset).toHaveBeenCalled()
  })

  it("should call addRandomProductToRow when add product button is clicked", async () => {
    render(<Dashboard viewModel={mockViewModel} />)
    const addButton = await screen.findByText(/add product/i)
    fireEvent.click(addButton)
    expect(mockViewModel.addRandomProductToRow).toHaveBeenCalledWith(mockRow.id)
  })

  it("should call removeProduct when remove product button is clicked", async () => {
    render(<Dashboard viewModel={mockViewModel} />)
    const removeButton = await screen.findByLabelText(/remove product/i)
    fireEvent.click(removeButton)
    expect(mockViewModel.removeProduct).toHaveBeenCalledWith(
      mockRow.id,
      mockProduct.id
    )
  })

  it("should call updateRowAlignment when alignment is changed", async () => {
    render(<Dashboard viewModel={mockViewModel} />)
    const select = await screen.findByRole("combobox")
    fireEvent.change(select, { target: { value: Alignment.RIGHT } })
    expect(mockViewModel.updateRowAlignment).toHaveBeenCalledWith(
      mockRow.id,
      Alignment.RIGHT
    )
  })

  it("should render empty state when no rows", async () => {
    mockViewModel.getRows.mockResolvedValueOnce([])
    render(<Dashboard viewModel={mockViewModel} />)
    expect(await screen.findByText(/add row/i)).toBeInTheDocument()
  })

  it("should render dashboard", () => {
    const { mockProductRepo, mockRowRepo } = createMockRepositories()
    const viewModel = new DashboardViewModel(mockProductRepo, mockRowRepo)
    render(<Dashboard viewModel={viewModel} />)
    expect(screen.getByText(/inditex row experience/i)).toBeInTheDocument()
  })
})
