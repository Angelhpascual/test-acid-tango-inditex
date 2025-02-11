import { IRowRepository } from "../../ports/IRowRepository";

export class RemoveProductUseCase {
  constructor(private rowRepository: IRowRepository) {}

  async execute(rowId: string, productId: string): Promise<void> {
    const row = await this.rowRepository.getById(rowId);
    if (!row) return;

    const updatedRow = row.removeProduct(productId);
    await this.rowRepository.update(updatedRow);
  }
}
