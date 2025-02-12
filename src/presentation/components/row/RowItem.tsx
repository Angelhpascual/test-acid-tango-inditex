import { useDroppable } from "@dnd-kit/core";
import { Row } from "../../../domain/entities/Row";
import { Alignment } from "../../../domain/valueObjects/Alignment";
import { ProductList } from "../product/ProductList";
import { motion } from "framer-motion";

type RowItemProps = {
  row: Row;
  onAlignmentChange: (rowId: string, alignment: Alignment) => Promise<void>;
  onAddProduct: (rowId: string) => Promise<void>;
  onRemoveProduct: (rowId: string, productId: string) => Promise<void>;
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
        border-2 p-6 rounded-2xl
        ${getBorderColor()} 
        ${getBackgroundColor()}
        shadow-lg backdrop-blur-sm
        h-[320px] min-w-[1024px] w-full
        transition-all duration-300
        relative flex flex-col
      `}
    >
      <div className="absolute top-4 right-4 flex flex-col gap-2 w-28">
        {canAddProduct && (
          <button
            onClick={() => onAddProduct(row.id)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium w-full
              transition-all duration-300
              bg-gradient-to-r from-green-400 to-emerald-500 
              hover:from-green-500 hover:to-emerald-600
              text-white shadow-md hover:shadow-lg
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
          className="border rounded-xl px-4 py-2 bg-white/80 shadow-md text-sm
          hover:border-purple-400 focus:border-purple-400 focus:ring-2 
          focus:ring-purple-200 transition-all w-full"
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
