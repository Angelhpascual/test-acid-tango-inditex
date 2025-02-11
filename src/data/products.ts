import { Product } from "../domain/entities/Product";
import { nanoid } from "nanoid";

export const initialProducts: Product[] = [
  new Product(
    nanoid(),
    "Camiseta Negra",
    19.99,
    "Camiseta de algodón 100%, diseño minimalista.",
    "/images/products/Shirt.webp",
  ),
  new Product(
    nanoid(),
    "Zapatillas Running",
    59.99,
    "Zapatillas ultraligeras para máximo confort.",
    "/images/products/Sneakers.webp",
  ),
  new Product(
    nanoid(),
    "Mochila Urbana",
    39.99,
    "Diseño ergonómico con compartimentos múltiples.",
    "/images/products/Bag.webp",
  ),
];
