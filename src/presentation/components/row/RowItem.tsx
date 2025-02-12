import { useDroppable } from "@dnd-kit/core";
import { Row } from "../../../domain/entities/Row";
import { Alignment } from "../../../domain/valueObjects/Alignment";
import { ProductList } from "../product/ProductList";
import { motion } from "framer-motion";

type RowItemProps = {
  row: Row;
  onAlignmentChange: (rowId: string, alignment: Alignment) => void;
  onAddProduct: (rowId: string) => void;
  onRemoveProduct: (rowId: string, productId: string) => void;
};

export const RowItem: React.FC<RowItemProps> = ({
  row,
  onAlignmentChange,
  onAddProduct,
  onRemoveProduct,
}) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: row?.id,
  });

  // Añadir verificación
  if (!row || !row.products) {
    return null; // O un componente de loading/error
  }

  // Solo mostrar efectos visuales si hay un elemento siendo arrastrado
  const isHovering = isOver && active;

  const getBorderColor = () => {
    if (!isHovering) return "border-gray-200";
    return "border-green-400";
  };

  const getBackgroundColor = () => {
    if (!isHovering) return "bg-white";
    return "bg-green-50 transition-colors duration-200";
  };

  const canAddProduct = row.products.length < 3;

  return (
    <motion.div
      ref={setNodeRef}
      className={`
        border-2 p-6 rounded-xl
        ${getBorderColor()} 
        ${getBackgroundColor()}
        shadow-sm h-[320px] min-w-[1024px] w-full
        transition-all duration-300
        relative
        flex flex-col
      `}
    >
      <div className="absolute top-4 right-4 flex flex-col gap-2 w-28">
        {canAddProduct && (
          <button
            onClick={() => onAddProduct(row.id)}
            className={`
              px-4 py-1.5 rounded-lg text-sm font-medium w-full
              transition-all duration-300
              bg-green-500 hover:bg-green-600 active:bg-green-700 text-white
            `}
          >
            Add Product
          </button>
        )}
        <select
          value={row.alignment}
          onChange={(e) =>
            onAlignmentChange(row.id, e.target.value as Alignment)
          }
          className="border rounded-lg px-3 py-1.5 bg-white shadow-sm text-sm
          hover:border-blue-500 focus:border-blue-500 focus:ring-2 
          focus:ring-blue-200 transition-all w-full"
        >
          <option value={Alignment.LEFT}>Left</option>
          <option value={Alignment.CENTER}>Center</option>
          <option value={Alignment.RIGHT}>Right</option>
        </select>
      </div>
      <div className="flex-1 flex items-center pr-32">
        <ProductList
          products={row.products}
          alignment={row.alignment}
          rowId={row.id}
          onRemoveProduct={(productId) => onRemoveProduct(row.id, productId)}
        />
      </div>
      {isHovering && !canAddProduct && (
        <div
          className="absolute inset-0 flex items-center justify-center 
        bg-red-100/50 rounded-xl backdrop-blur-sm"
        >
          <p
            className="text-red-600 font-semibold bg-white px-6 py-3 
          rounded-lg shadow-lg"
          >
            Row is full (max 3 products)
          </p>
        </div>
      )}
    </motion.div>
  );
};
