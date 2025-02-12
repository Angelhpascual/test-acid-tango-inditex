import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { Product } from "../../../domain/entities/Product";

type ProductCardProps = {
  product: Product;
  rowId: string;
  isDragging?: boolean;
  onRemove?: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  rowId,
  isDragging,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: product.id,
    data: {
      product,
      fromRowId: rowId,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div className="relative group">
      {/* Botón de eliminar fuera del área arrastrable */}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove product"
          className="absolute -top-2 -right-2 z-10 w-6 h-6
          bg-red-500 text-white rounded-full
          opacity-0 group-hover:opacity-100
          hover:bg-red-600 transition-all duration-200
          flex items-center justify-center
          shadow-md"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Contenido arrastrable */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          motion-div relative w-56 bg-white rounded-lg shadow-md p-3
          hover:shadow-lg transition-all duration-300 
          cursor-grab active:cursor-grabbing
          ${isDragging ? "opacity-50" : ""}
        `}
      >
        <div className="mb-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-contain rounded-lg
            bg-gray-50 p-2 transition-transform hover:scale-105"
          />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-gray-800 truncate">
            {product.name}
          </h3>
          <p
            data-testid="product-description"
            className="text-gray-600 text-xs line-clamp-2 h-8"
          >
            {product.description}
          </p>
          <p className="text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
