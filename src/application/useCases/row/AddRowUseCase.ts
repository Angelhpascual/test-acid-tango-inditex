import { IRowRepository } from "../../ports/IRowRepository";
import { Row } from "../../../domain/entities/Row";
import { Alignment } from "../../../domain/valueObjects/Alignment";

export class AddRowUseCase {
  private readonly MAX_ROWS = 3;

  constructor(private readonly rowRepository: IRowRepository) {
    if (!rowRepository) {
      throw new Error("Row repository is required");
    }
  }

  async execute(): Promise<void> {
    console.log("AddRowUseCase.execute - Starting"); // Debug log

    const currentRows = await this.rowRepository.getAll();
    if (currentRows.length >= this.MAX_ROWS) {
      throw new Error(`Cannot add more than ${this.MAX_ROWS} rows`);
    }

    const newRow = Row.create({
      alignment: Alignment.CENTER,
      products: [],
    });
    console.log("AddRowUseCase.execute - Row created:", newRow);

    await this.rowRepository.save(newRow);
    console.log("AddRowUseCase.execute - Row saved");
  }
}
