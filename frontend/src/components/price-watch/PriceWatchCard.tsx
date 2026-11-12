import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingDown, TrendingUp, Bell, Bot, Play, Pause, Trash2, ShieldCheck, ArrowRight
} from 'lucide-react';
import type { PriceWatch } from '@/types/priceWatch';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Sparkline } from '@/components/common/Sparkline';
import { formatCurrency } from '@/utils/currency';
import { formatRelative } from '@/utils/date';
import { useAppStore } from '@/store/appStore';

export function PriceWatchCard({
  watch,
  onEdit,
}: {
  watch: PriceWatch;
  onEdit?: (watch: PriceWatch) => void;
}) {
  const navigate = useNavigate();
  const { updatePriceWatch, deletePriceWatch, user } = useAppStore();

  const priceDrop = watch.initialPrice - watch.currentPrice;
  const percentDrop = Math.round((priceDrop / watch.initialPrice) * 100);
  const isTargetMet = watch.currentPrice <= watch.targetPrice;
  const historyPrices = watch.priceHistory.map((h) => h.price);

  const togglePause = () => {
    updatePriceWatch(watch.id, {
      status: watch.status === 'active' ? 'paused' : 'active',
    });
  };

  const toggleAutoBuy = () => {
    const newMode: 'notify' | 'auto_purchase' = watch.purchaseMode === 'auto_purchase' ? 'notify' : 'auto_purchase';
    updatePriceWatch(watch.id, {
      purchaseMode: newMode,
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete price watch for "${watch.product.title}"?`)) {
      deletePriceWatch(watch.id);
    }
  };

  return (
    <div className="bg-white border border-[#E9E6DE] hover:border-[#192923]/30 rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)] transition-all duration-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E9E6DE]">
        {/* Product Info */}
        <div 
          onClick={() => navigate(`/product/${watch.productId}`)}
          className="flex items-center gap-3.5 cursor-pointer min-w-0 flex-1"
        >
          <img
            src={watch.product.image}
            alt={watch.product.title}
            className="w-13 h-13 rounded-[10px] object-cover bg-[#F6F4EE] flex-shrink-0 border border-[#E9E6DE]"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block truncate">
              {watch.product.brand} · {watch.product.merchant}
            </span>
            <h3 className="text-sm font-bold text-[#192923] truncate hover:underline">
              {watch.product.title}
            </h3>
            <span className="text-[11px] text-[#858A83] flex items-center gap-1.5 mt-0.5">
              <span>Last checked {formatRelative(watch.lastCheckedAt)}</span>
            </span>
          </div>
        </div>

        {/* Small Inline Sparkline */}
        <div className="hidden lg:flex flex-col items-end px-3">
          <span className="text-[10px] text-[#858A83] uppercase font-semibold mb-1">Price Trend</span>
          <Sparkline
            data={historyPrices}
            width={110}
            height={26}
            strokeWidth={1.75}
          />
        </div>

        {/* Status Badge & Auto-Buy Switch */}
        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          <button
            onClick={togglePause}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              watch.status === 'active'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-gray-100 text-gray-700'
            }`}
            title="Click to toggle monitoring"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${watch.status === 'active' ? 'bg-emerald-600' : 'bg-gray-500'}`} />
            <span>{watch.status === 'active' ? (isTargetMet ? 'Price Reached' : 'Watching') : 'Paused'}</span>
          </button>

          <button
            onClick={toggleAutoBuy}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              watch.purchaseMode === 'auto_purchase'
                ? 'bg-[#F08A63]/15 text-[#E27952] border border-[#F08A63]/30'
                : 'bg-[#F6F4EE] text-[#858A83] hover:text-[#192923] border border-[#E9E6DE]'
            }`}
            title="Toggle sandbox auto-purchase"
          >
            <Bot size={13} />
            <span>{watch.purchaseMode === 'auto_purchase' ? 'Sandbox Auto-Buy' : 'Notify Only'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-b border-[#E9E6DE]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block">Current Price</span>
          <div className="text-base font-extrabold tabular-nums text-[#192923] mt-0.5">
            {formatCurrency(watch.currentPrice, watch.currency)}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block">Target Trigger</span>
          <div className="text-base font-extrabold tabular-nums text-emerald-700 mt-0.5">
            {formatCurrency(watch.targetPrice, watch.currency)}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block">Price Movement</span>
          <div className="flex items-center gap-1.5 mt-1">
            {priceDrop > 0 ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingDown size={14} /> −{percentDrop}% ({formatCurrency(priceDrop, watch.currency)})
              </span>
            ) : (
              <span className="text-xs text-[#858A83] font-medium">Stable</span>
            )}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block">Condition</span>
          <div className="text-xs font-semibold text-[#192923] mt-1">
            {isTargetMet ? (
              <span className="text-emerald-700 font-bold">Target Qualified</span>
            ) : (
              <span className="text-[#858A83]">Awaiting Drop</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="pt-3 flex items-center justify-between">
        <button
          onClick={handleDelete}
          className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Remove</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/product/${watch.productId}`)}
            className="text-xs h-8"
          >
            Product Details
          </Button>
          {isTargetMet && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/product/${watch.productId}`)}
              className="text-xs h-8 font-semibold"
            >
              Buy Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
