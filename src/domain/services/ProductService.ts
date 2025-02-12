import { Product } from "../entities/Product";
import { Row } from "../entities/Row";

export class ProductService {
  static canMoveProduct(_product: Product, targetRow: Row): boolean {
    return targetRow.canAddProduct();
  }

  static validateProduct(product: Product): boolean {
    return (
      product.name.length > 0 &&
      product.price > 0 &&
      product.description.length > 0 &&
      product.image.length > 0
    );
  }
}
