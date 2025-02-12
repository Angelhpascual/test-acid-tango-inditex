import { Product } from "../../domain/entities/Product";

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getRandom(): Promise<Product | null>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  update(product: Product): Promise<void>;
  reset(): Promise<void>;
}
