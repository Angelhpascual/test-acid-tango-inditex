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

  console.log(
    `🟢 Renderizando ProductCard para: ${product.name} en fila ${rowId}`,
  );

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: product.id as string,
    data: { rowId, product },
  });

  const style: React.CSSProperties = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="relative bg-white p-3 shadow-md rounded-md w-36 flex flex-col items-center border border-gray-200 hover:shadow-lg transition-all cursor-grab"
    >
      {/* 🔹 Imagen y detalles del producto */}
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

      {/* 🔥 Botón de eliminar FUERA del área draggable */}
      <button
        data-cancel-drag // ✅ Excluye este botón del drag & drop
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-all"
        onClick={(e) => {
          e.stopPropagation(); // ✅ Evita que el drag & drop interfiera
          console.log(`🚀 Eliminando producto ${product.id} de fila ${rowId}`);
          removeProductFromRow(rowId, product.id);
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default ProductCard;
