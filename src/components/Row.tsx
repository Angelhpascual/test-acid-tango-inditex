import { useRowStore } from "../store/rowStore";
import { useProductStore } from "../store/productStore";
import { useDroppable } from "@dnd-kit/core";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

type RowProps = {
  row: {
    id: string;
    products: Product[];
    alignment: "left" | "center" | "right";
  };
};

const Row: React.FC<RowProps> = ({ row }) => {
  const { setRowAligment, addProductToRow } = useRowStore();
  const { products } = useProductStore();

  const { setNodeRef, isOver } = useDroppable({
    id: row.id,
  });

  const handleAddProduct = () => {
    if (row.products.length >= 3) return;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (randomProduct) {
      addProductToRow(row.id, {
        ...randomProduct,
        id: randomProduct.id.toString(),
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full p-4 rounded-md min-h-32 border border-gray-300 shadow-md transition-all 
        ${isOver ? "bg-green-200 border-green-500" : "bg-white"}
      `}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Fila {row.id}</h2>

        <select
          value={row.alignment}
          onChange={(e) =>
            setRowAligment(
              row.id,
              e.target.value as "left" | "center" | "right",
            )
          }
          className="border rounded px-2 py-1"
        >
          <option value="left">⬅ Izquierda</option>
          <option value="center">⬛ Centro</option>
          <option value="right">➡ Derecha</option>
        </select>

        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 disabled:opacity-50"
          disabled={row.products.length >= 3}
        >
          ➕ Añadir Producto
        </button>
      </div>

      <div
        className={`flex gap-4 ${
          row.alignment === "left"
            ? "justify-start"
            : row.alignment === "center"
              ? "justify-center"
              : "justify-end"
        }`}
      >
        {row.products.map((product) => (
          <ProductCard key={product.id} product={product} rowId={row.id} />
        ))}
      </div>
    </div>
  );
};

export default Row;
