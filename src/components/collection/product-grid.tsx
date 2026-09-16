import type { Product } from "@/types/product";
import { ProductCard } from "@/components/collection/product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
