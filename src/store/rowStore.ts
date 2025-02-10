import { create } from "zustand";
import { nanoid } from "nanoid";

type Aligment = "left" | "center" | "right";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

type Row = {
  id: string;
  products: Product[]; // Asegúrate de que aquí es un array de Product, no un array vacío
  alignment: Aligment;
};

type RowStore = {
  rows: Row[];
  addRow: () => void;
  removeRow: (id: string) => void;
  moveRow: (fromIndex: number, toIndex: number) => void;
  addProductToRow: (rowId: string, product: Product) => void;
  moveProduct: (
    fromRowId: string,
    toRowId: string,
    productId: string,
    toIndex: number,
  ) => void;
  removeProductFromRow: (rowId: string, productId: string) => void;
  setRowAligment: (rowId: string, alignment: Aligment) => void;
};

export const useRowStore = create<RowStore>((set) => ({
  rows: [
    {
      id: "default-row",
      products: [],
      alignment: "center",
    },
  ],
  addRow: () =>
    set((state) => {
      console.log("➕ Agregando una nueva fila...");
      const newRow: Row = { id: nanoid(), products: [], alignment: "center" }; // ✅ Aseguramos que es del tipo `Row`
      return { rows: [...state.rows, newRow] };
    }),
  removeRow: (id) =>
    set((state) => ({ rows: state.rows.filter((r) => r.id !== id) })),
  moveRow: (fromIndex, toIndex) =>
    set((state) => {
      const updateRows = [...state.rows];
      const [movedRow] = updateRows.splice(fromIndex, 1);
      updateRows.splice(toIndex, 0, movedRow);
      return { rows: updateRows };
    }),
  addProductToRow: (rowId, product) =>
    set((state) => ({
      rows: state.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              products: [
                ...row.products,
                { ...product, id: nanoid() }, // ✅ Generamos un nuevo ID único
              ],
            }
          : row,
      ),
    })),
  removeProductFromRow: (rowId, productId) =>
    set((state) => {
      console.log(`Intentando eliminar producto ${productId} de fila ${rowId}`);

      const updatedRows = state.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              products: row.products.filter((p) => {
                console.log(`Comparando ${p.id} con ${productId}`);
                return p.id !== productId;
              }),
            }
          : row,
      );

      console.log("🆕 Nuevo estado de filas:", updatedRows);

      return { rows: updatedRows };
    }),
  moveProduct: (fromRowId, toRowId, productId, toIndex) =>
    set((state) => {
      const fromRow = state.rows.find((row) => row.id === fromRowId);
      const toRow = state.rows.find((row) => row.id === toRowId);

      if (!fromRow || !toRow || toRow.products.length >= 3) return state;

      const productToMove = fromRow.products.find((p) => p.id === productId);
      if (!productToMove) return state;

      const updatedRows = state.rows.map((row) => {
        if (row.id === fromRowId) {
          return {
            ...row,
            products: row.products.filter((p) => p.id !== productId),
          };
        }
        if (row.id === toRowId) {
          return {
            ...row,
            products: [
              ...row.products.slice(0, toIndex),
              productToMove,
              ...row.products.slice(toIndex),
            ],
          };
        }
        return row;
      });

      return { rows: updatedRows };
    }),
  setRowAligment: (rowId, alignment) =>
    set((state) => ({
      rows: state.rows.map((row) =>
        row.id === rowId ? { ...row, alignment } : row,
      ),
    })),
}));
