import { IProductRepository } from "../../ports/IProductRepository";
import { IRowRepository } from "../../ports/IRowRepository";
import { Product } from "../../../domain/entities/Product";
import { nanoid } from "nanoid";

export class AddRandomProductToRowUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly rowRepository: IRowRepository,
  ) {
    if (!rowRepository) throw new Error("Row repository is required");
    if (!productRepository) throw new Error("Product repository is required");
  }

  async execute(rowId: string): Promise<void> {
    try {
      const row = await this.rowRepository.getById(rowId);
      if (!row) throw new Error(`Row with id ${rowId} not found`);

      if (row.products.length >= 3) {
        throw new Error("Row cannot have more than 3 products");
      }

      const randomProduct = await this.productRepository.getRandom();
      if (!randomProduct)
        throw new Error("No products available in the catalog");

      const newProduct = new Product(
        nanoid(),
        randomProduct.name,
        randomProduct.price,
        randomProduct.description,
        randomProduct.image,
      );

      const updatedRow = row.addProduct(newProduct);
      await this.rowRepository.update(updatedRow);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Row cannot have more than 3 products")
      ) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Failed to add random product: ${error.message}`);
      }
      throw error;
    }
  }
}
