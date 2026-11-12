import { X, Check, Star, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '@/types/product';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/currency';
import { assessAffordability } from '@/utils/affordability';
import { useAppStore } from '@/store/appStore';

export interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  onBuy: (product: Product) => void;
  onTrack: (product: Product) => void;
}

export function ProductComparison({ products, onRemove, onClear, onBuy, onTrack }: ProductComparisonProps) {
  const { financialProfile } = useAppStore();

  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 max-w-5xl mx-auto z-40 bg-[#192923] text-white rounded-[16px] shadow-2xl border border-[#303933] p-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-[#F08A63]">Comparison Tray</span>
          <span className="text-xs text-white/50">({products.length} of 3 items)</span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {products.map((p) => {
          const afford = assessAffordability(p.price, financialProfile);
          return (
            <div key={p.id} className="bg-white/5 rounded-[12px] p-3 relative flex flex-col justify-between border border-white/5">
              <button
                onClick={() => onRemove(p.id)}
                className="absolute top-2 right-2 p-1 text-white/40 hover:text-white rounded-[6px] hover:bg-white/10 cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="flex gap-2.5 items-start pr-6 mb-2">
                <img src={p.image} alt={p.title} className="w-12 h-12 rounded-[8px] object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-white/50 uppercase">{p.brand}</span>
                  <h4 className="text-xs font-semibold text-white truncate">{p.title}</h4>
                  <div className="text-sm font-bold text-white mt-0.5 tabular-nums">
                    {formatCurrency(p.price, p.currency)}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-white/60 space-y-1 mb-2.5">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="text-white font-medium">{p.merchant}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    <Star size={10} className="fill-amber-400 text-amber-400" /> {p.rating || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Budget Impact:</span>
                  <span className={`font-semibold ${
                    afford.decision === 'COMFORTABLE' ? 'text-emerald-400' :
                    afford.decision === 'WITHIN_BUDGET' ? 'text-emerald-400' :
                    afford.decision === 'BUDGET_STRAIN' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {afford.decision.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10">
                <Button variant="outline" size="sm" className="h-8 text-xs border-white/20 text-white hover:bg-white/10" onClick={() => onTrack(p)}>
                  Track
                </Button>
                <Button variant="primary" size="sm" className="h-8 text-xs font-semibold" onClick={() => onBuy(p)}>
                  Buy
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
