import {
  DndContext,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRowStore } from "../store/rowStore";
import Row from "./Row";

const Dashboard: React.FC = () => {
  const { rows, addRow, moveProduct } = useRowStore();

  // ✅ Configurar sensores para ignorar botones de eliminar
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // ✅ Manejar el drop de productos
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const fromRowId = active.data.current?.rowId;
    const product = active.data.current?.product;
    const toRowId = String(over.id);

    if (fromRowId && toRowId && fromRowId !== toRowId) {
      moveProduct(fromRowId, toRowId, product.id, 0);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex flex-col items-center bg-gray-100 h-screen w-full p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Zara Category Manager
        </h1>

        {/* ✅ RECUPERAMOS EL BOTÓN DE AÑADIR FILA */}
        <button
          onClick={addRow}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
        >
          ➕ Añadir Fila
        </button>

        {/* ✅ MOSTRAR FILAS SI EXISTEN */}
        <div className="space-y-4 w-full max-w-4xl">
          {rows.length > 0 ? (
            rows.map((row) => <Row key={row.id} row={row} />)
          ) : (
            <p className="text-gray-500">
              No hay filas aún. Añade una fila para comenzar.
            </p>
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default Dashboard;
