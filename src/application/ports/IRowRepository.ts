import { Row } from "../../domain/entities/Row";

export interface IRowRepository {
  getAll(): Promise<Row[]>;
  getById(id: string): Promise<Row | null>;
  save(row: Row): Promise<void>;
  delete(id: string): Promise<void>;
  update(row: Row): Promise<void>;
  updateOrder(rows: Row[]): Promise<void>;
  reset(): Promise<void>;
}
