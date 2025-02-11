import { IRowRepository } from "../../application/ports/IRowRepository";
import { Row } from "../../domain/entities/Row";
import { Product } from "../../domain/entities/Product";
import { LocalStorageRepository } from "./LocalStorageRepository";
import { Alignment } from "../../domain/valueObjects/Alignment";

type StoredRow = {
  id: string;
  products: StoredProduct[];
  alignment: Alignment;
};

type StoredProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

export class LocalStorageRowRepository implements IRowRepository {
  private readonly storage: LocalStorageRepository<StoredRow>;

  constructor() {
    this.storage = new LocalStorageRepository<StoredRow>("rows");
  }

  private reconstructRow(rowData: StoredRow): Row {
    return new Row(
      rowData.id,
      rowData.products.map(
        (p) => new Product(p.id, p.name, p.price, p.description, p.image),
      ),
      rowData.alignment,
    );
  }

  async getAll(): Promise<Row[]> {
    const rows = await this.storage.load();
    return rows.map((row) => this.reconstructRow(row));
  }

  async getById(id: string): Promise<Row | null> {
    const rows = await this.getAll();
    return rows.find((r) => r.id === id) || null;
  }

  async save(row: Row): Promise<void> {
    const rows = await this.getAll();
    const storedRow: StoredRow = {
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
    await this.storage.save([...rows, storedRow]);
  }

  async delete(id: string): Promise<void> {
    const rows = await this.getAll();
    const storedRows = rows
      .filter((r) => r.id !== id)
      .map((r) => ({
        id: r.id,
        products: r.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          image: p.image,
        })),
        alignment: r.alignment,
      }));
    await this.storage.save(storedRows);
  }

  async update(row: Row): Promise<void> {
    const rows = await this.getAll();
    const index = rows.findIndex((r) => r.id === row.id);
    if (index !== -1) {
      const storedRows = rows.map((r) => ({
        id: r.id,
        products: r.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          image: p.image,
        })),
        alignment: r.alignment,
      }));
      storedRows[index] = {
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
      await this.storage.save(storedRows);
    }
  }

  async updateOrder(rowIds: string[]): Promise<void> {
    const rows = await this.getAll();
    const orderedRows = rowIds
      .map((id) => rows.find((r) => r.id === id))
      .filter((r): r is Row => r !== undefined)
      .map((r) => ({
        id: r.id,
        products: r.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          image: p.image,
        })),
        alignment: r.alignment,
      }));
    await this.storage.save(orderedRows);
  }

  async reset(): Promise<void> {
    await this.storage.clear();
  }
}
