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

  // ✅ Hacemos que cada producto sea draggable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: product.id,
    data: { rowId, product },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{ ...style }}
      {...listeners}
      {...attributes}
      className="relative bg-white p-4 shadow-md rounded-md w-36 flex flex-col items-center cursor-grab"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-24 object-contain rounded-md"
      />
      <h2 className="text-sm font-bold mt-2">{product.name}</h2>
      <p className="text-xs text-gray-600">{product.description}</p>
      <p className="text-md font-semibold text-indigo-600 mt-2">
        💰${product.price.toFixed(2)}
      </p>

      {/* Botón para eliminar */}
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => removeProductFromRow(rowId, product.id)}
      >
        ❌
      </button>
    </div>
  );
};

export default ProductCard;
