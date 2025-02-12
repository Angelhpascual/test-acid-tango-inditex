import { IRowRepository } from "../../application/ports/IRowRepository";
import { Row } from "../../domain/entities/Row";
import { LocalStorageRepository } from "./LocalStorageRepository";

interface SerializedRow {
  id: string;
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  }[];
  alignment: string;
}

export class LocalStorageRowRepository
  extends LocalStorageRepository<SerializedRow>
  implements IRowRepository
{
  constructor() {
    super("rows");
  }

  private serializeRow(row: Row): SerializedRow {
    return {
      id: row.id,
      products: row.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.image,
      })),
      alignment: row.alignment,
    };
  }

  async getAll(): Promise<Row[]> {
    const data = await this.load();
    return data.map((rowData) => Row.fromJSON(rowData));
  }

  async getById(id: string): Promise<Row | null> {
    const rows = await this.getAll();
    return rows.find((row) => row.id === id) || null;
  }

  async save(row: Row): Promise<void> {
    const rows = await this.getAll();
    const serializedRows = [...rows, row].map((r) => this.serializeRow(r));
    await this.saveItems(serializedRows);
  }

  async delete(id: string): Promise<void> {
    const rows = await this.getAll();
    const filteredRows = rows.filter((row) => row.id !== id);
    const serializedRows = filteredRows.map((r) => this.serializeRow(r));
    await this.saveItems(serializedRows);
  }

  async update(row: Row): Promise<void> {
    const currentRows = await this.load();
    const updatedRows = currentRows.map((storedRow) =>
      storedRow.id === row.id ? this.serializeRow(row) : storedRow,
    );
    await this.saveItems(updatedRows);
  }

  async updateOrder(rows: Row[]): Promise<void> {
    const serializedRows = rows.map((r) => this.serializeRow(r));
    await this.saveItems(serializedRows);
  }

  async reset(): Promise<void> {
    await this.saveItems([]);
  }
}
