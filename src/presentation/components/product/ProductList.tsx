import { Product } from "../../../domain/entities/Product";
import { ProductCard } from "../product/ProductCard";
import { Alignment } from "../../../domain/valueObjects/Alignment";
import { AnimatePresence } from "framer-motion";

type ProductListProps = {
  products: Product[];
  alignment: Alignment;
  rowId: string;
  onRemoveProduct: (productId: string) => void;
};

export const ProductList: React.FC<ProductListProps> = ({
  products,
  alignment,
  rowId,
  onRemoveProduct,
}) => {
  const getAlignmentClass = (alignment: Alignment) => {
    switch (alignment) {
      case Alignment.LEFT:
        return "justify-start";
      case Alignment.CENTER:
        return "justify-center";
      case Alignment.RIGHT:
        return "justify-end";
      default:
        return "justify-start";
    }
  };

  return (
    <div className="w-full h-full flex items-center px-6">
      <div
        className={`
          w-full flex gap-6 items-center
          ${getAlignmentClass(alignment)}
        `}
      >
        <AnimatePresence mode="sync">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              rowId={rowId}
              onRemove={() => onRemoveProduct(product.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
