import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Layers } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProductSearch } from '@/components/shopping/ProductSearch';
import { ProductGrid } from '@/components/shopping/ProductGrid';
import { PriceWatchForm } from '@/components/price-watch/PriceWatchForm';
import { CheckoutModal } from '@/components/shopping/CheckoutModal';
import { useProducts } from '@/hooks/useProducts';
import type { Product, SearchFilters } from '@/types/product';

export function Discover() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { products, isLoading, search } = useProducts();
  const [comparingProducts, setComparingProducts] = useState<Product[]>([]);
  const [watchModalProduct, setWatchModalProduct] = useState<Product | null>(null);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  useEffect(() => {
    search(initialQuery);
  }, [search, initialQuery]);

  const handleSearch = (query: string, filters: SearchFilters) => {
    search(query, filters);
  };

  const handleToggleCompare = (product: Product) => {
    setComparingProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        setFeedbackNotice('Comparison limit reached: You can compare up to 3 products simultaneously.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleTrack = (product: Product) => {
    setWatchModalProduct(product);
    setIsWatchModalOpen(true);
  };

  const handleBuy = (product: Product) => {
    setCheckoutProduct(product);
  };

  return (
    <PageContainer
      title="Discover"
      subtitle="Editorial product catalog, natural-language search, and verified affordability assessment."
    >
      <div className="space-y-6 pt-1">
        {/* Search & Compact Filter Toolbar in Clean White Card */}
        <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
          <ProductSearch
            onSearch={handleSearch}
            isLoading={isLoading}
            initialQuery={initialQuery}
          />
        </div>

        {/* Feedback Notice Toast */}
        {feedbackNotice && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-[10px] flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
            <span>{feedbackNotice}</span>
            <button
              onClick={() => setFeedbackNotice(null)}
              className="text-amber-800 hover:text-amber-950 font-bold ml-4 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Catalog Results Header */}
        <div className="flex items-center justify-between text-xs text-[#858A83] px-1">
          <span>
            Showing <strong className="text-[#192923]">{products.length}</strong> available items
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Ranked by suitability & budget fit</span>
          </span>
        </div>

        {/* Premium 3-4 Column Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          onTrack={handleTrack}
          onBuy={handleBuy}
          comparingIds={comparingProducts.map((p) => p.id)}
          onToggleCompare={handleToggleCompare}
        />

        {/* Product Comparison Bottom Bar */}
        {comparingProducts.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#192923] text-white border-t border-[#303933] p-4 shadow-2xl animate-in slide-in-from-bottom">
            <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-[#F08A63]" />
                <span className="text-xs font-semibold">
                  Comparing {comparingProducts.length} items:
                </span>
                <div className="flex items-center gap-2">
                  {comparingProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-[6px] text-xs"
                    >
                      <span className="truncate max-w-[140px] font-medium">{p.title}</span>
                      <button
                        onClick={() => handleToggleCompare(p)}
                        className="text-white/60 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setComparingProducts([])}
                  className="text-xs text-white/60 hover:text-white px-2 py-1"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Price Watch Modal */}
        <PriceWatchForm
          open={isWatchModalOpen}
          onClose={() => {
            setIsWatchModalOpen(false);
            setWatchModalProduct(null);
          }}
          product={watchModalProduct}
        />

        {/* Sandbox Checkout Modal */}
        <CheckoutModal
          open={!!checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
          product={checkoutProduct}
        />
      </div>
    </PageContainer>
  );
}
