import { IRowRepository } from "../../application/ports/IRowRepository";
import { Row } from "../../domain/entities/Row";

export class RowRepository implements IRowRepository {
  private rows: Row[] = [];

  async getAll(): Promise<Row[]> {
    return this.rows;
  }

  async getById(id: string): Promise<Row | null> {
    return this.rows.find((r) => r.id === id) || null;
  }

  async save(row: Row): Promise<void> {
    this.rows.push(row);
  }

  async delete(id: string): Promise<void> {
    this.rows = this.rows.filter((r) => r.id !== id);
  }

  async update(row: Row): Promise<void> {
    const index = this.rows.findIndex((r) => r.id === row.id);
    if (index !== -1) {
      this.rows[index] = row;
    }
  }

  async updateOrder(rows: Row[]): Promise<void> {
    this.rows = rows
      .map((row) => this.rows.find((r) => r.id === row.id))
      .filter((row): row is Row => row !== undefined);
  }

  async reset(): Promise<void> {
    this.rows = [];
  }
}
