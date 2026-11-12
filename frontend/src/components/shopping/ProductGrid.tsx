import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { Search } from 'lucide-react';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onTrack?: (product: Product) => void;
  onBuy?: (product: Product) => void;
  comparingIds?: string[];
  onToggleCompare?: (product: Product) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  isLoading,
  onTrack,
  onBuy,
  comparingIds = [],
  onToggleCompare,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search criteria, price range, or category filters.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Search size={24} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onTrack={onTrack}
          onBuy={onBuy}
          isComparing={comparingIds.includes(product.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}

