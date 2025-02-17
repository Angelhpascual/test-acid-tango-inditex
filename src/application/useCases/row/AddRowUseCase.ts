import { IRowRepository } from "../../ports/IRowRepository"
import { Row } from "../../../domain/entities/Row"
import { Alignment } from "../../../domain/valueObjects/Alignment"

export class AddRowUseCase {
  constructor(private readonly rowRepository: IRowRepository) {
    if (!rowRepository) {
      throw new Error("Row repository is required")
    }
  }

  async execute(): Promise<void> {
    console.log("AddRowUseCase.execute - Starting") // Debug log

    const newRow = Row.create({
      alignment: Alignment.CENTER,
      products: [],
    })
    console.log("AddRowUseCase.execute - Row created:", newRow)

    await this.rowRepository.save(newRow)
    console.log("AddRowUseCase.execute - Row saved")
  }
}
