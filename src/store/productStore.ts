import { create } from "zustand";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

type ProductStore = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [
    {
      id: 1,
      name: "Camiseta Negra",
      price: 19.99,
      description: "Camiseta de algodón 100%, diseño minimalista.",
      image: "/images/Shirt.webp",
    },
    {
      id: 2,
      name: "Zapatillas Running",
      price: 59.99,
      description: "Zapatillas ultraligeras para máximo confort.",
      image: "/images/Sneakers.webp",
    },
    {
      id: 3,
      name: "Mochila Urbana",
      price: 39.99,
      description: "Diseño ergonómico con compartimentos múltiples.",
      image: "/images/Bag.webp",
    },
  ],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  removeProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
}));
