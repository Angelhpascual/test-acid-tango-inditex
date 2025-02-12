import { IProductRepository } from "../../application/ports/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { LocalStorageRepository } from "./LocalStorageRepository";
import { initialProducts } from "../../data/products";

/**
 * Implementación de IProductRepository que usa localStorage para persistencia
 * Incluye manejo de productos iniciales y operaciones CRUD
 */
export class LocalStorageProductRepository
  extends LocalStorageRepository<Product>
  implements IProductRepository
{
  constructor() {
    super("products");
  }

  async getAll(): Promise<Product[]> {
    const products = await this.load();
    return products.length > 0 ? products : initialProducts;
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.id === id) || null;
  }

  async getRandom(): Promise<Product | null> {
    const products = await this.getAll();
    if (products.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  }

  async save(product: Product): Promise<void> {
    const products = await this.getAll();
    products.push(product);
    await this.saveItems(products);
  }

  async update(product: Product): Promise<void> {
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      await this.saveItems(products);
    }
  }

  async delete(id: string): Promise<void> {
    const products = await this.getAll();
    const filteredProducts = products.filter((p) => p.id !== id);
    await this.saveItems(filteredProducts);
  }

  async reset(): Promise<void> {
    await this.saveItems(initialProducts);
  }
}
