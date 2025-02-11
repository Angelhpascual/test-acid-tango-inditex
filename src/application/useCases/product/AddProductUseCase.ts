import { IProductRepository } from "../../ports/IProductRepository";
import { Product } from "../../../domain/entities/Product";

export class AddProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(product: Omit<Product, "id">): Promise<Product> {
    const newProduct = Product.create(product);
    await this.productRepository.save(newProduct);
    return newProduct;
  }
}
