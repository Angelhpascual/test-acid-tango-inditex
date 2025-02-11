import { Product } from "./Product";
import { Alignment } from "../valueObjects/Alignment";
import { Row as RowType } from "../types/Row";

export class Row implements RowType {
  private readonly MAX_PRODUCTS = 3;

  constructor(
    public readonly id: string,
    public readonly products: Product[],
    public readonly alignment: Alignment,
  ) {
    if (products.length > this.MAX_PRODUCTS) {
      throw new Error(
        `Row cannot have more than ${this.MAX_PRODUCTS} products`,
      );
    }
  }

  static create(props: {
    id?: string;
    products?: Product[];
    alignment?: Alignment;
  }): Row {
    return new Row(
      props.id || crypto.randomUUID(),
      props.products || [],
      props.alignment || Alignment.CENTER,
    );
  }

  canAddProduct(): boolean {
    return this.products.length < this.MAX_PRODUCTS;
  }

  addProduct(product: Product): Row {
    if (!this.canAddProduct()) {
      throw new Error(
        `Cannot add more than ${this.MAX_PRODUCTS} products to a row`,
      );
    }
    return new Row(this.id, [...this.products, product], this.alignment);
  }

  removeProduct(productId: string): Row {
    return new Row(
      this.id,
      this.products.filter((p) => p.id !== productId),
      this.alignment,
    );
  }

  updateAlignment(alignment: Alignment): Row {
    return new Row(this.id, this.products, alignment);
  }
}
