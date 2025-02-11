import { motion } from "motion/react";
import { useDraggable } from "@dnd-kit/core";
import { useRowStore } from "../store/rowStore";

type ProductProps = {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  };
  rowId: string;
};

const ProductCard: React.FC<ProductProps> = ({ product, rowId }) => {
  const { removeProductFromRow } = useRowStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: product.id as string,
      data: { rowId, product },
    });

  const motionStyle: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : "none",
    zIndex: isDragging ? 50 : 1,
    position: isDragging ? "fixed" : "relative",
    pointerEvents: isDragging ? "none" : "auto",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={motionStyle}
      {...listeners}
      {...attributes}
      className="relative bg-white p-3 shadow-md rounded-md w-36 flex flex-col items-center border border-gray-200 hover:shadow-lg transition-all cursor-grab"
      layout
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileDrag={{ scale: 1.1, opacity: 0.8 }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-24 object-contain rounded-md"
      />
      <h2 className="text-sm font-bold mt-2 text-gray-800">{product.name}</h2>
      <p className="text-xs text-gray-500">{product.description}</p>
      <p className="text-md font-semibold text-green-600 mt-2">
        💰${product.price.toFixed(2)}
      </p>

      <button
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-all"
        onClick={() => removeProductFromRow(rowId, product.id)}
      >
        ✖
      </button>
    </motion.div>
  );
};

export default ProductCard;
