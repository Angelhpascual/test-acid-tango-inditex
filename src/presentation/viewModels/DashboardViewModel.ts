import { IProductRepository } from "../../application/ports/IProductRepository";
import { IRowRepository } from "../../application/ports/IRowRepository";
import { Product } from "../../domain/entities/Product";
import { Row } from "../../domain/entities/Row";
import { AddProductUseCase } from "../../application/useCases/product/AddProductUseCase";
import { AddRowUseCase } from "../../application/useCases/row/AddRowUseCase";
import { Alignment } from "../../domain/valueObjects/Alignment";
import { MoveProductUseCase } from "../../application/useCases/product/MoveProductUseCase";
import { UpdateRowAlignmentUseCase } from "../../application/useCases/row/UpdateRowAlignmentUseCase";
import { RemoveProductUseCase } from "../../application/useCases/product/RemoveProductUseCase";
import { AddRandomProductToRowUseCase } from "../../application/useCases/row/AddRandomProductToRowUseCase";

export class DashboardViewModel {
  private moveProductUseCase: MoveProductUseCase;
  private updateRowAlignmentUseCase: UpdateRowAlignmentUseCase;
  private removeProductUseCase: RemoveProductUseCase;
  private readonly addRowUseCase: AddRowUseCase;
  private readonly addRandomProductToRowUseCase: AddRandomProductToRowUseCase;

  constructor(
    private readonly productRepository: IProductRepository,
    private readonly rowRepository: IRowRepository,
  ) {
    if (!rowRepository) {
      throw new Error("Row repository is required");
    }
    this.moveProductUseCase = new MoveProductUseCase(rowRepository);
    this.updateRowAlignmentUseCase = new UpdateRowAlignmentUseCase(
      rowRepository,
    );
    this.removeProductUseCase = new RemoveProductUseCase(rowRepository);
    this.addRowUseCase = new AddRowUseCase(rowRepository);
    this.addRandomProductToRowUseCase = new AddRandomProductToRowUseCase(
      rowRepository,
      productRepository,
    );
  }

  private addProductUseCase = new AddProductUseCase(this.productRepository);

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.getAll();
  }

  async getRows(): Promise<Row[]> {
    return await this.rowRepository.getAll();
  }

  async addProduct(product: Omit<Product, "id">): Promise<void> {
    await this.addProductUseCase.execute(product);
  }

  async addRow(): Promise<void> {
    console.log("DashboardViewModel.addRow - Starting"); // Debug log
    await this.addRowUseCase.execute();
    console.log("DashboardViewModel.addRow - Row added"); // Debug log
  }

  async updateRowAlignment(rowId: string, alignment: Alignment): Promise<void> {
    await this.updateRowAlignmentUseCase.execute(rowId, alignment);
  }

  async moveProduct(
    fromRowId: string,
    toRowId: string,
    productId: string,
  ): Promise<void> {
    await this.moveProductUseCase.execute(fromRowId, toRowId, productId);
  }

  async removeProduct(rowId: string, productId: string): Promise<void> {
    await this.removeProductUseCase.execute(rowId, productId);
  }

  async addRandomProductToRow(rowId: string): Promise<void> {
    await this.addRandomProductToRowUseCase.execute(rowId);
  }

  async resetAll(): Promise<void> {
    await Promise.all([
      this.productRepository.reset(),
      this.rowRepository.reset(),
    ]);
  }
}
