import { IProductRepository } from "../../application/ports/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { LocalStorageRepository } from "./LocalStorageRepository";
import { initialProducts } from "../../data/products"; // Importar productos iniciales

export class LocalStorageProductRepository implements IProductRepository {
  private readonly storage: LocalStorageRepository<Product>;

  constructor() {
    this.storage = new LocalStorageRepository<Product>("products");
    this.initializeProducts();
  }

  private async initializeProducts(): Promise<void> {
    const products = await this.getAll();
    if (products.length === 0) {
      await this.storage.save(initialProducts);
    }
  }

  async getAll(): Promise<Product[]> {
    return await this.storage.load();
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.id === id) || null;
  }

  async save(product: Product): Promise<void> {
    const products = await this.getAll();
    await this.storage.save([...products, product]);
  }

  async delete(id: string): Promise<void> {
    const products = await this.getAll();
    await this.storage.save(products.filter((p) => p.id !== id));
  }

  async update(product: Product): Promise<void> {
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      await this.storage.save(products);
    }
  }

  async reset(): Promise<void> {
    await this.storage.clear();
    await this.initializeProducts(); // Reinicializar con productos por defecto
  }
}
