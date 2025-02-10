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
  const { products } = useProductStore(); // ✅ Obtenemos la lista de productos

  // ✅ Hacemos que la fila sea una zona donde se puedan soltar productos
  const { setNodeRef } = useDroppable({
    id: row.id,
  });

  // ✅ Función para añadir un producto aleatorio
  const handleAddProduct = () => {
    if (row.products.length >= 3) return; // ✅ Limita a 3 productos por fila
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
      className="relative w-full bg-white shadow-md p-4 rounded-md"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Fila {row.id}</h2>

        {/* Selector de alineación */}
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

        {/* ✅ Botón para añadir producto */}
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 disabled:opacity-50"
          disabled={row.products.length >= 3} // ✅ Se desactiva si ya hay 3 productos
        >
          ➕ Añadir Producto
        </button>
      </div>

      {/* Contenedor de productos con alineación */}
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
