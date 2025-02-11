import { IRowRepository } from "../../ports/IRowRepository";

export class MoveProductUseCase {
  constructor(private rowRepository: IRowRepository) {}

  async execute(
    fromRowId: string,
    toRowId: string,
    productId: string,
  ): Promise<void> {
    console.log("Moving product:", { fromRowId, toRowId, productId });

    const [fromRow, toRow] = await Promise.all([
      this.rowRepository.getById(fromRowId),
      this.rowRepository.getById(toRowId),
    ]);

    if (!fromRow || !toRow) {
      console.error("Row not found:", { fromRow, toRow });
      return;
    }

    const product = fromRow.products.find((p) => p.id === productId);
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    if (!toRow.canAddProduct()) {
      console.error("Target row is full");
      return;
    }

    // Primero eliminar el producto de la fila de origen
    const updatedFromRow = fromRow.removeProduct(productId);
    await this.rowRepository.update(updatedFromRow);

    // Luego añadir el producto a la fila de destino
    const updatedToRow = toRow.addProduct(product);
    await this.rowRepository.update(updatedToRow);
  }
}
