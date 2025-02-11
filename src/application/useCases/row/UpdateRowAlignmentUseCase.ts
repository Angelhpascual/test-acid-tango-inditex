import { IRowRepository } from "../../ports/IRowRepository";
import { Alignment } from "../../../domain/valueObjects/Alignment";

export class UpdateRowAlignmentUseCase {
  constructor(private rowRepository: IRowRepository) {}

  async execute(rowId: string, alignment: Alignment): Promise<void> {
    const row = await this.rowRepository.getById(rowId);
    if (row) {
      const updatedRow = row.updateAlignment(alignment);
      await this.rowRepository.update(updatedRow);
    }
  }
}
