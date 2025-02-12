import { IRowRepository } from "../../ports/IRowRepository";

export class MoveProductUseCase {
  constructor(private readonly rowRepository: IRowRepository) {}

  async execute(
    productId: string,
    fromRowId: string,
    toRowId: string,
  ): Promise<void> {
    const fromRow = await this.rowRepository.getById(fromRowId);
    if (!fromRow) throw new Error("Source row not found");

    const toRow = await this.rowRepository.getById(toRowId);
    if (!toRow) throw new Error("Target row not found");

    const product = fromRow.findProduct(productId);
    if (!product) throw new Error("Product not found");
    if (!toRow.canAddProduct()) throw new Error("Target row is full");

    const updatedFromRow = fromRow.removeProduct(productId);
    await this.rowRepository.update(updatedFromRow);

    const updatedToRow = toRow.addProduct(product);
    await this.rowRepository.update(updatedToRow);

    const verifyFrom = await this.rowRepository.getById(fromRowId);
    const verifyTo = await this.rowRepository.getById(toRowId);

    if (verifyFrom?.findProduct(productId)) {
      throw new Error("Product was not removed from source row");
    }

    if (!verifyTo?.findProduct(productId)) {
      throw new Error("Product was not added to target row");
    }
  }
}
