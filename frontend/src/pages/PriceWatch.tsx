import { useState } from 'react';
import { 
  Plus, Eye, TrendingDown, Bot, Sparkles, RefreshCw, 
  LayoutList, LayoutGrid, CheckCircle2, ArrowRight
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PriceWatchCard } from '@/components/price-watch/PriceWatchCard';
import { PriceWatchForm } from '@/components/price-watch/PriceWatchForm';
import { Sparkline } from '@/components/common/Sparkline';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppStore } from '@/store/appStore';
import { formatCurrency } from '@/utils/currency';
import { formatRelative } from '@/utils/date';
import { useNavigate } from 'react-router-dom';
import { priceWatchService } from '@/services/api/priceWatchService';

export function PriceWatch() {
  const navigate = useNavigate();
  const { priceWatches, user, updatePriceWatch } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const activeWatches = priceWatches.filter((w) => w.status === 'active');
  const autoBuyWatches = priceWatches.filter((w) => w.purchaseMode === 'auto_purchase' && w.status === 'active');
  const priceDroppedWatches = priceWatches.filter((w) => w.currentPrice < w.initialPrice);

  // Demo Action: Simulate Price Drop
  const handleSimulateDrop = async () => {
    priceWatchService.simulateDrop().catch(() => {});
    if (priceWatches.length === 0) return;
    const targetWatch = priceWatches[0];
    const newPrice = targetWatch.targetPrice - 500; // triggers qualification in INR!
    
    updatePriceWatch(targetWatch.id, {
      currentPrice: newPrice,
      priceHistory: [
        ...targetWatch.priceHistory,
        {
          id: 'po_drop_' + Date.now(),
          productId: targetWatch.productId,
          price: newPrice,
          currency: targetWatch.currency,
          merchant: targetWatch.product.merchant,
          observedAt: new Date().toISOString(),
        },
      ],
    });

    setSimulationNotice(
      `Price drop detected on "${targetWatch.product.title}"! Dropped to ${formatCurrency(newPrice, targetWatch.currency)}. Target trigger met for ${targetWatch.purchaseMode === 'auto_purchase' ? 'Sandbox Auto-Buy' : 'Instant Alert'}.`
    );
  };

  return (
    <PageContainer
      title="Price Watch"
      subtitle="Track product price movements, set threshold alert rules, and automate agentic sandbox purchases."
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateDrop}
            leftIcon={<RefreshCw size={13} className="text-[#F08A63]" />}
            className="text-xs font-semibold"
            title="Simulate price drop for presentation demonstration"
          >
            Simulate Drop
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFormOpen(true)}
            leftIcon={<Plus size={15} />}
            className="text-xs font-semibold"
          >
            Create Watch
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pt-1">
        {/* Simulation Alert Banner */}
        {simulationNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[12px] flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-emerald-700 flex-shrink-0" />
              <span className="font-medium">{simulationNotice}</span>
            </div>
            <button
              onClick={() => setSimulationNotice(null)}
              className="text-emerald-800 hover:text-emerald-950 font-bold ml-4 cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Compact Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-4.5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
              Active Monitored SKUs
            </span>
            <div className="text-2xl font-extrabold tabular-nums text-[#192923]">
              {activeWatches.length}
            </div>
            <p className="mt-1 text-xs text-[#858A83]">
              Checked across verified merchants
            </p>
          </div>

          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-4.5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
              Auto-Buy Authorized
            </span>
            <div className="text-2xl font-extrabold tabular-nums text-[#192923] flex items-center gap-2">
              <span>{autoBuyWatches.length}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F08A63]/15 text-[#E27952]">
                Active
              </span>
            </div>
            <p className="mt-1 text-xs text-[#858A83]">
              Pre-approved sandbox demonstration
            </p>
          </div>

          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-4.5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
              Recent Price Drops
            </span>
            <div className="text-2xl font-extrabold tabular-nums text-emerald-700">
              {priceDroppedWatches.length} items
            </div>
            <p className="mt-1 text-xs text-[#858A83]">
              Tracking lower than initial baseline
            </p>
          </div>
        </div>

        {/* View Mode Switcher Toolbar */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-base font-bold font-heading text-[#192923]">
              Watchlist Items
            </h2>
            <p className="text-xs text-[#858A83]">
              Real-time prices, historical sparklines, and auto-buy execution rules
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-[10px] border border-[#E9E6DE]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-[7px] text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-[#F6F4EE] text-[#192923] font-semibold' : 'text-[#858A83] hover:text-[#192923]'
              }`}
              title="Compact Watchlist Rows"
            >
              <LayoutList size={14} />
              <span className="hidden sm:inline">Rows</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-[7px] text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'cards' ? 'bg-[#F6F4EE] text-[#192923] font-semibold' : 'text-[#858A83] hover:text-[#192923]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {priceWatches.length === 0 ? (
          <EmptyState
            title="No price watches yet"
            description="Add products to your watchlist from Discover or paste an item URL to monitor price changes."
            action={{
              label: 'Discover Products',
              onClick: () => navigate('/discover'),
            }}
          />
        ) : viewMode === 'table' ? (
          /* Compact Watchlist Rows (Linear & Sellegr8 discipline) */
          <div className="bg-white border border-[#E9E6DE] rounded-[14px] overflow-hidden shadow-[0_6px_24px_rgba(25,41,35,0.045)] divide-y divide-[#E9E6DE]">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[#F6F4EE]/80 text-[11px] font-bold uppercase tracking-wider text-[#858A83]">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-right">Current Price</div>
              <div className="col-span-2 text-right">Target Price</div>
              <div className="col-span-2 text-center">Trend</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            {priceWatches.map((watch) => {
              const historyPrices = watch.priceHistory.map((h) => h.price);
              const priceDrop = watch.initialPrice - watch.currentPrice;
              const percentDrop = Math.round((priceDrop / watch.initialPrice) * 100);
              const isTargetMet = watch.currentPrice <= watch.targetPrice;

              return (
                <div
                  key={watch.id}
                  onClick={() => navigate(`/product/${watch.productId}`)}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-5 py-3.5 items-center hover:bg-[#F6F4EE]/50 transition-colors cursor-pointer"
                >
                  {/* Thumbnail & Title (col 5) */}
                  <div className="col-span-1 md:col-span-5 flex items-center gap-3 min-w-0">
                    <img
                      src={watch.product.image}
                      alt={watch.product.title}
                      className="w-12 h-12 rounded-[8px] object-cover bg-[#F6F4EE] flex-shrink-0 border border-[#E9E6DE]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block truncate">
                        {watch.product.brand} · {watch.product.merchant}
                      </span>
                      <h3 className="text-xs font-bold text-[#192923] truncate hover:underline">
                        {watch.product.title}
                      </h3>
                      {priceDrop > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                          <TrendingDown size={12} /> −{percentDrop}% drop
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Current Price (col 2) */}
                  <div className="col-span-1 md:col-span-2 flex md:flex-col justify-between md:items-end">
                    <span className="text-[10px] text-[#858A83] md:hidden">Current:</span>
                    <span className="text-sm font-extrabold tabular-nums text-[#192923]">
                      {formatCurrency(watch.currentPrice, watch.currency)}
                    </span>
                  </div>

                  {/* Target Price (col 2) */}
                  <div className="col-span-1 md:col-span-2 flex md:flex-col justify-between md:items-end">
                    <span className="text-[10px] text-[#858A83] md:hidden">Target:</span>
                    <div>
                      <span className="text-sm font-extrabold tabular-nums text-emerald-700">
                        {formatCurrency(watch.targetPrice, watch.currency)}
                      </span>
                      {isTargetMet && (
                        <span className="text-[10px] text-emerald-700 font-bold block md:text-right">
                          ✓ Reached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline Sparkline (col 2) */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="text-[10px] text-[#858A83] md:hidden">Trend:</span>
                    <Sparkline
                      data={historyPrices}
                      width={100}
                      height={24}
                      strokeWidth={1.75}
                    />
                  </div>

                  {/* Status Badge (col 1) */}
                  <div className="col-span-1 flex md:justify-end">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isTargetMet
                        ? 'bg-emerald-100 text-emerald-800'
                        : watch.purchaseMode === 'auto_purchase'
                        ? 'bg-[#F08A63]/15 text-[#E27952]'
                        : 'bg-[#F6F4EE] text-[#858A83]'
                    }`}>
                      {isTargetMet ? 'Reached' : watch.purchaseMode === 'auto_purchase' ? 'Auto-Buy' : 'Watching'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priceWatches.map((watch) => (
              <PriceWatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        )}

        {/* Create Price Watch Modal Form */}
        <PriceWatchForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </PageContainer>
  );
}
