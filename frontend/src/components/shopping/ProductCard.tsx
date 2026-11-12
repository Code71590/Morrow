import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, Sparkles } from 'lucide-react';
import type { Product } from '@/types/product';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/currency';
import { useAppStore } from '@/store/appStore';
import { assessAffordability } from '@/utils/affordability';

export interface ProductCardProps {
  product: Product;
  onTrack?: (product: Product) => void;
  onBuy?: (product: Product) => void;
  isComparing?: boolean;
  onToggleCompare?: (product: Product) => void;
}

export function ProductCard({
  product,
  onTrack,
  onBuy,
  isComparing,
  onToggleCompare,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { financialProfile, memories, priceWatches } = useAppStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if product is already being tracked
  const isTracked = priceWatches.some(
    (pw) => pw.productId === product.id && pw.status === 'active'
  );

  // Match preference
  const matchedMemory = memories.find(
    (m) =>
      (m.category === 'brand_preference' &&
        m.content.toLowerCase().includes(product.brand.toLowerCase())) ||
      (m.category === 'shopping_preference' &&
        (product.tags || []).some((t) => m.content.toLowerCase().includes(t.toLowerCase())))
  );

  // Quick affordability check
  const affordability = assessAffordability(product.price, financialProfile);

  return (
    <div className="group bg-white border border-[#E9E6DE] hover:border-[#192923]/30 rounded-[14px] overflow-hidden flex flex-col transition-all duration-200 shadow-[0_6px_24px_rgba(25,41,35,0.045)] hover:shadow-[0_8px_30px_rgba(25,41,35,0.07)]">
      {/* 1. Large Product Imagery Frame (Consistent 4:3 Ratio) */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative aspect-[4/3] bg-[#F6F4EE] overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Floating Match Badge */}
        {matchedMemory && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="bg-[#192923] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles size={10} className="text-[#F08A63]" /> Preference Match
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* 4. Merchant & Category */}
          <div className="flex items-center justify-between text-[11px] text-[#858A83]">
            <span className="font-semibold uppercase tracking-wider">{product.merchant}</span>
            <span>{product.brand}</span>
          </div>

          {/* 2. Product Name */}
          <h3
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-sm font-bold font-heading text-[#192923] line-clamp-1 hover:text-[#F08A63] cursor-pointer transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* 5. Short Personal Recommendation / Budget Context */}
          <div className="text-[11px] font-medium pt-0.5">
            {affordability.decision === 'COMFORTABLE' && (
              <span className="text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Fits easily within discretionary runway
              </span>
            )}
            {affordability.decision === 'WITHIN_BUDGET' && (
              <span className="text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Within monthly spending allowance
              </span>
            )}
            {affordability.decision === 'BUDGET_STRAIN' && (
              <span className="text-amber-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Uses {affordability.budgetPercentageUsed}% of discretionary runway
              </span>
            )}
            {affordability.decision === 'NOT_RECOMMENDED' && (
              <span className="text-rose-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Exceeds discretionary budget
              </span>
            )}
          </div>
        </div>

        {/* 3. Pricing in INR & 6. Primary Action (Soft Persimmon) */}
        <div className="pt-2.5 border-t border-[#E9E6DE] space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-extrabold tabular-nums text-[#192923] font-heading">
              {formatCurrency(product.price, product.currency)}
            </span>
            <button
              onClick={() => onTrack ? onTrack(product) : navigate(`/product/${product.id}`)}
              className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                isTracked ? 'text-emerald-700' : 'text-[#858A83] hover:text-[#192923]'
              }`}
            >
              <Eye size={13} />
              <span>{isTracked ? 'Tracking' : 'Watch'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/product/${product.id}`)}
              className="text-xs h-9 font-medium"
            >
              Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBuy ? onBuy(product) : navigate(`/product/${product.id}`)}
              leftIcon={<ShoppingCart size={13} />}
              className="text-xs h-9 font-semibold"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
