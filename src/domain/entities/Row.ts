import { nanoid } from "nanoid";
import { Product } from "./Product";
import { Alignment } from "../valueObjects/Alignment";

interface RowProps {
  id?: string;
  products?: Product[];
  alignment?: Alignment;
}

interface ProductJSON {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface RowJSON {
  id: string;
  products: ProductJSON[];
  alignment: string;
}

export class Row {
  private constructor(
    public readonly id: string,
    public readonly products: Product[] = [],
    public readonly alignment: Alignment = Alignment.CENTER,
  ) {}

  static create(params: Partial<RowProps> = {}): Row {
    return new Row(
      params.id ?? nanoid(),
      params.products || [],
      params.alignment || Alignment.CENTER,
    );
  }

  canAddProduct(): boolean {
    return this.products.length < 3;
  }

  addProduct(product: Product): Row {
    if (!product.id || !product.name || !product.price) {
      throw new Error("Invalid product data");
    }
    if (this.products.length >= 3) {
      throw new Error("Cannot add more than 3 products");
    }
    if (this.findProduct(product.id)) {
      throw new Error("Product already exists");
    }
    return new Row(this.id, [...this.products, product], this.alignment);
  }

  removeProduct(productId: string): Row {
    const product = this.findProduct(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return new Row(
      this.id,
      this.products.filter((p) => p.id !== productId),
      this.alignment,
    );
  }

  updateAlignment(alignment: Alignment): Row {
    if (!Object.values(Alignment).includes(alignment)) {
      throw new Error("Invalid alignment value");
    }
    return new Row(this.id, this.products, alignment);
  }

  findProduct(productId: string): Product | null {
    return this.products.find((p) => p.id === productId) ?? null;
  }

  static fromJSON(json: RowJSON): Row {
    return new Row(
      json.id,
      (json.products || []).map(
        (p: ProductJSON) =>
          new Product(p.id, p.name, p.price, p.description, p.image),
      ),
      (json.alignment as Alignment) || Alignment.CENTER,
    );
  }
}
