import { useEffect, useState, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"
import { Product } from "../../../domain/entities/Product"
import { Row } from "../../../domain/entities/Row"
import { Alignment } from "../../../domain/valueObjects/Alignment"
import { RowItem } from "../row/RowItem"
import { ProductCard } from "../product/ProductCard"
import { DashboardViewModel } from "../../viewModels/DashboardViewModel"

interface Props {
  viewModel: DashboardViewModel
}

export const Dashboard: React.FC<Props> = ({ viewModel }) => {
  const [rows, setRows] = useState<Row[]>([])
  const [activeProduct, setActiveProduct] = useState<{
    product: Product
    fromRowId: string
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const loadData = useCallback(async () => {
    console.log("Dashboard.loadData - Starting")
    const [rowsData] = await Promise.all([viewModel.getRows()])
    setRows(rowsData)
    console.log("Dashboard.loadData - After setState:", { rowsData })
  }, [viewModel])

  useEffect(() => {
    console.log("Dashboard - Initial render")
    loadData()
  }, [loadData])

  console.log("Dashboard - Rendering with rows:", rows) // Log en cada render

  const handleAddRow = async () => {
    try {
      console.log("Dashboard.handleAddRow - Starting")
      await viewModel.addRow()
      console.log("Dashboard.handleAddRow - Row added, loading data")
      await loadData()
      console.log("Dashboard.handleAddRow - Data loaded")
    } catch (error) {
      console.error("Error adding row:", error)
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  const handleAlignmentChange = async (rowId: string, alignment: Alignment) => {
    await viewModel.updateRowAlignment(rowId, alignment)
    await loadData()
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const product = active.data.current?.product as Product
    const rowId = active.data.current?.rowId as string
    setActiveProduct({ product, fromRowId: rowId })
    setIsDragging(true)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    console.log("DragEnd:", {
      active: active?.data.current,
      over,
      sourceRowId: active?.data.current?.fromRowId,
      targetRowId: over?.id,
    })

    if (!active || !over) {
      setIsDragging(false)
      setActiveProduct(null)
      return
    }

    const sourceRowId = active.data.current?.fromRowId
    const targetRowId = over.id as string

    if (sourceRowId !== targetRowId) {
      try {
        console.log("Moving product:", {
          sourceRowId,
          targetRowId,
          productId: active.id,
        })
        await viewModel.moveProduct(
          active.id as string,
          sourceRowId,
          targetRowId
        )
        await loadData()
      } catch (error) {
        console.error("Error moving product:", error)
      }
    }

    setIsDragging(false)
    setActiveProduct(null)
  }

  const handleAddRandomProduct = async (rowId: string) => {
    try {
      await viewModel.addRandomProductToRow(rowId)
      await loadData()
    } catch (error) {
      console.error("Error adding random product:", error)
    }
  }

  const handleRemoveProduct = async (rowId: string, productId: string) => {
    await viewModel.removeProduct(rowId, productId)
    await loadData()
  }

  const handleReset = async () => {
    await viewModel.resetAll()
    await loadData()
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white/80 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <button
            onClick={handleReset}
            className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-xl 
            shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            Reset All
          </button>
        </div>

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handleAddRow}
                disabled={rows.length >= 3}
                className={`
                  px-6 py-3 rounded-xl font-medium shadow-md
                  transition-all duration-300
                  ${
                    rows.length >= 3
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white hover:shadow-lg"
                  }
                `}
              >
                Add Row ({rows.length}/3)
              </button>
              {rows.length >= 3 && (
                <p className="text-red-400 text-sm font-medium">
                  Maximum number of rows reached
                </p>
              )}
            </div>

            <div className="space-y-6">
              {rows.map((row) => (
                <RowItem
                  key={row.id}
                  row={row}
                  onAlignmentChange={handleAlignmentChange}
                  onAddProduct={handleAddRandomProduct}
                  onRemoveProduct={handleRemoveProduct}
                />
              ))}
            </div>
          </div>
          <DragOverlay>
            {activeProduct && (
              <ProductCard
                product={activeProduct.product}
                rowId={activeProduct.fromRowId}
                isDragging={isDragging}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default Dashboard
