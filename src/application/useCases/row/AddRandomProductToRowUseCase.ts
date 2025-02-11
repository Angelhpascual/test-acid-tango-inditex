import { IRowRepository } from "../../ports/IRowRepository";
import { IProductRepository } from "../../ports/IProductRepository";
import { Row } from "../../../domain/entities/Row";
import { Alignment } from "../../../domain/valueObjects/Alignment";
import { Product } from "../../../domain/entities/Product";

export class AddRandomProductToRowUseCase {
  constructor(
    private readonly rowRepository: IRowRepository,
    private readonly productRepository: IProductRepository,
  ) {
    if (!rowRepository) throw new Error("Row repository is required");
    if (!productRepository) throw new Error("Product repository is required");
  }

  async execute(rowId: string): Promise<void> {
    const row = await this.rowRepository.getById(rowId);
    if (!row) throw new Error("Row not found");

    if (row.products.length >= 3) {
      throw new Error("Row cannot have more than 3 products");
    }

    const products = await this.productRepository.getAll();
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    if (!randomProduct) throw new Error("No products available");

    const updatedRow = Row.create({
      id: row.id,
      products: [
        ...row.products,
        new Product(
          crypto.randomUUID(),
          randomProduct.name,
          randomProduct.price,
          randomProduct.description,
          randomProduct.image,
        ),
      ],
      alignment: row.alignment as Alignment,
    });

    await this.rowRepository.update(updatedRow);
  }
}
