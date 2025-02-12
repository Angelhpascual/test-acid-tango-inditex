import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";
import React from "react";
import { HTMLMotionProps } from "framer-motion";

// Mock de Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: (props: HTMLMotionProps<"div">) => React.createElement("div", props),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock de @dnd-kit/core
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => children,
  DragOverlay: ({ children }: { children: React.ReactNode }) => children,
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

// Mock de localStorage
const storageMock = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => storageMock.get(key) || null),
  setItem: vi.fn((key: string, value: string) => storageMock.set(key, value)),
  clear: vi.fn(() => storageMock.clear()),
  removeItem: vi.fn((key: string) => storageMock.delete(key)),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Limpiar el storage antes de cada test
beforeEach(() => {
  storageMock.clear();
  vi.clearAllMocks();
});

export { localStorageMock };
