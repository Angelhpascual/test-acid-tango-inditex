/// <reference lib="dom" />

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardViewModel } from "../presentation/viewModels/DashboardViewModel";
import { IProductRepository } from "../application/ports/IProductRepository";
import { IRowRepository } from "../application/ports/IRowRepository";
import { Row } from "../domain/entities/Row";
import { Alignment } from "../domain/valueObjects/Alignment";

// Mock de motion/react y otras dependencias de UI
vi.mock("motion/react", () => ({
  motion: {
    div: "div",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@dnd-kit/core", () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
  }),
  useDroppable: () => ({
    setNodeRef: () => {},
    isOver: false,
    active: null,
  }),
}));

// Antes del mock de localStorage, añadir el tipo
type Storage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  clear: () => void;
  removeItem: (key: string) => void;
  length: number;
  key: (index: number) => string | null;
};

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};
window.localStorage = localStorageMock as Storage;

describe("App Integration Tests", () => {
  let productRepository: IProductRepository;
  let rowRepository: IRowRepository;
  let viewModel: DashboardViewModel;

  beforeEach(() => {
    // Limpiar mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Crear repositorios mock
    productRepository = {
      getAll: vi.fn().mockResolvedValue([]),
      getById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      reset: vi.fn(),
    };

    rowRepository = {
      getAll: vi.fn().mockResolvedValue([]),
      getById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      updateOrder: vi.fn(),
      reset: vi.fn(),
    };

    viewModel = new DashboardViewModel(productRepository, rowRepository);
  });

  it("should initialize with empty rows", async () => {
    const rows = await viewModel.getRows();
    expect(rows).toHaveLength(0);
  });

  it("should add a new row", async () => {
    await viewModel.addRow();
    expect(rowRepository.save).toHaveBeenCalled();
  });

  it("should not allow more than 3 rows", async () => {
    // Simular que ya hay 3 filas
    const existingRows = [Row.create({}), Row.create({}), Row.create({})];
    vi.mocked(rowRepository.getAll).mockResolvedValue(existingRows);

    await expect(viewModel.addRow()).rejects.toThrow(
      "Cannot add more than 3 rows",
    );
  });

  it("should update row alignment", async () => {
    const mockRow = Row.create({ id: "test-row" });
    vi.mocked(rowRepository.getById).mockResolvedValue(mockRow);

    await viewModel.updateRowAlignment(mockRow.id, Alignment.RIGHT);
    expect(rowRepository.update).toHaveBeenCalled();
  });

  it("should reset all data", async () => {
    await viewModel.resetAll();
    expect(productRepository.reset).toHaveBeenCalled();
    expect(rowRepository.reset).toHaveBeenCalled();
  });
});
