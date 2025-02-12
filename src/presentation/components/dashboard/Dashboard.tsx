import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Product } from "../../../domain/entities/Product";
import { Row } from "../../../domain/entities/Row";
import { Alignment } from "../../../domain/valueObjects/Alignment";
import { RowItem } from "../row/RowItem";
import { ProductCard } from "../product/ProductCard";
import { DashboardViewModel } from "../../viewModels/DashboardViewModel";

interface Props {
  viewModel: DashboardViewModel;
}

export const Dashboard: React.FC<Props> = ({ viewModel }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [activeProduct, setActiveProduct] = useState<{
    product: Product;
    fromRowId: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const loadData = useCallback(async () => {
    console.log("Dashboard.loadData - Starting");
    const [rowsData] = await Promise.all([viewModel.getRows()]);
    setRows(rowsData);
    console.log("Dashboard.loadData - After setState:", { rowsData });
  }, [viewModel]);

  useEffect(() => {
    console.log("Dashboard - Initial render");
    loadData();
  }, [loadData]);

  console.log("Dashboard - Rendering with rows:", rows); // Log en cada render

  const handleAddRow = async () => {
    try {
      console.log("Dashboard.handleAddRow - Starting");
      await viewModel.addRow();
      console.log("Dashboard.handleAddRow - Row added, loading data");
      await loadData();
      console.log("Dashboard.handleAddRow - Data loaded");
    } catch (error) {
      console.error("Error adding row:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleAlignmentChange = async (rowId: string, alignment: Alignment) => {
    await viewModel.updateRowAlignment(rowId, alignment);
    await loadData();
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const product = active.data.current?.product as Product;
    const rowId = active.data.current?.rowId as string;
    setActiveProduct({ product, fromRowId: rowId });
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("DragEnd:", {
      active: active?.data.current,
      over,
      sourceRowId: active?.data.current?.fromRowId,
      targetRowId: over?.id,
    });

    if (!active || !over) {
      setIsDragging(false);
      setActiveProduct(null);
      return;
    }

    const sourceRowId = active.data.current?.fromRowId;
    const targetRowId = over.id as string;

    if (sourceRowId !== targetRowId) {
      try {
        console.log("Moving product:", {
          sourceRowId,
          targetRowId,
          productId: active.id,
        });
        await viewModel.moveProduct(
          active.id as string,
          sourceRowId,
          targetRowId,
        );
        await loadData();
      } catch (error) {
        console.error("Error moving product:", error);
      }
    }

    setIsDragging(false);
    setActiveProduct(null);
  };

  const handleAddRandomProduct = async (rowId: string) => {
    try {
      await viewModel.addRandomProductToRow(rowId);
      await loadData();
    } catch (error) {
      console.error("Error adding random product:", error);
    }
  };

  const handleRemoveProduct = async (rowId: string, productId: string) => {
    await viewModel.removeProduct(rowId, productId);
    await loadData();
  };

  const handleReset = async () => {
    await viewModel.resetAll();
    await loadData();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Reset All
        </button>
      </div>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="p-8 min-w-[1024px] max-w-[1200px] mx-auto overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleAddRow}
              disabled={rows.length >= 3}
              className={`px-4 py-2 rounded ${
                rows.length >= 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
              } text-white`}
            >
              Add Row ({rows.length}/3)
            </button>
            {rows.length >= 3 && (
              <p className="text-red-500 text-sm">
                Maximum number of rows reached
              </p>
            )}
          </div>
          <div className="space-y-4">
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
  );
};

export default Dashboard;
