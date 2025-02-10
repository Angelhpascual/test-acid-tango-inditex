import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { useRowStore } from "../store/rowStore";
import Row from "./Row";

const Dashboard: React.FC = () => {
  const { rows, addRow, moveProduct } = useRowStore();

  // ✅ Función que maneja el drop de productos
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const fromRowId = active.data.current?.rowId;
    const product = active.data.current?.product;
    const toRowId = String(over.id); // ✅ Convertimos a string

    if (fromRowId && toRowId && fromRowId !== toRowId) {
      moveProduct(fromRowId, toRowId, product.id, 0);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center bg-gray-100 h-screen w-full p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Zara Category Manager
        </h1>

        {/* ✅ Botón para añadir filas */}
        <button
          onClick={addRow}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          ➕ Añadir Fila
        </button>

        <div className="space-y-4 w-full max-w-4xl">
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default Dashboard;
