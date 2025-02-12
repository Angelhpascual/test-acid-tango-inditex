import { IRowRepository } from "../../ports/IRowRepository";

export class RemoveRowUseCase {
  constructor(private readonly rowRepository: IRowRepository) {}

  async execute(rowId: string): Promise<void> {
    await this.rowRepository.delete(rowId);
  }
}
