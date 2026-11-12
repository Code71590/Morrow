import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Eye, ArrowRight, ShieldCheck, Wallet, 
  Sparkles, CheckCircle2, TrendingDown, ArrowUpRight, ShoppingBag
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { FintechMetricCards } from '@/components/fintech/FintechMetricCards';
import { MonthlySpendChart } from '@/components/fintech/MonthlySpendChart';
import { RecentTransactionsList } from '@/components/fintech/RecentTransactionsList';
import { ProductCard } from '@/components/shopping/ProductCard';
import { PriceWatchForm } from '@/components/price-watch/PriceWatchForm';
import { CheckoutModal } from '@/components/shopping/CheckoutModal';
import { Sparkline } from '@/components/common/Sparkline';
import { Button } from '@/components/common/Button';
import { useAppStore } from '@/store/appStore';
import { assistantService } from '@/services/api/assistantService';
import { DEMO_PRODUCTS } from '@/data/demoData';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { getGreeting } from '@/utils/formatting';
import { calculateDiscretionary } from '@/utils/affordability';
import type { Product } from '@/types/product';

export function Overview() {
  const navigate = useNavigate();
  const {
    user,
    financialProfile,
    priceWatches,
    orders,
    transactions,
    setChatOpen,
    addChatMessage,
    updateLastMessage,
    currentConversationId,
    setCurrentConversationId,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [productToWatch, setProductToWatch] = useState<Product | null>(null);

  const handleAskCompanion = (textPrompt?: string) => {
    const text = (textPrompt || searchQuery).trim();
    setChatOpen(true);

    if (text) {
      const userMsgId = 'u_' + Date.now();
      addChatMessage({
        id: userMsgId,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      });

      const botMsgId = 'b_' + (Date.now() + 1);
      addChatMessage({
        id: botMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isLoading: true,
      });

      assistantService
        .chat(text, currentConversationId || undefined)
        .then((result) => {
          if (result?.conversationId) {
            setCurrentConversationId(result.conversationId);
          }
          updateLastMessage({
            content: result.response,
            isLoading: false,
            relatedProducts: result.relatedProducts,
          });
        })
        .catch((err) => {
          console.warn('Error from companion query on home page:', err);
          updateLastMessage({
            content: `I'm Morrow, your shopping assistant. I recorded your query: "${text}". Please check your available discretionary balance and let me know if you'd like to explore products!`,
            isLoading: false,
          });
        });
    }
  };

  // Recommendations: 4 curated products
  const recommendations = DEMO_PRODUCTS.slice(0, 4);
  const activeWatches = priceWatches.filter((w) => w.status === 'active').slice(0, 3);
  const recentOrders = orders.slice(0, 2);

  const discretionary = calculateDiscretionary(financialProfile);

  // Copilot Money Pacing calculations dynamically derived from real transactions & profile
  const daysInMonth = 30;
  const currentDay = 12;
  const monthProgressPct = Math.round((currentDay / daysInMonth) * 100);
  const monthlyDiscretionaryAllowance = Math.max(
    0,
    financialProfile.monthlyIncome - financialProfile.essentialExpenses - financialProfile.savingsCommitment
  );
  const actualDiscretionarySpent = transactions
    .filter(
      (t) =>
        t.transactionType === 'expense' &&
        t.category !== 'Rent' &&
        (t.transactionDate.includes('-11-') || t.transactionDate.startsWith('2026-11'))
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const spendingProgressPct = monthlyDiscretionaryAllowance > 0
    ? Math.min(100, Math.round((actualDiscretionarySpent / monthlyDiscretionaryAllowance) * 100))
    : 100;
  const idealPaceSpent = Math.round((monthlyDiscretionaryAllowance * currentDay) / daysInMonth);
  const pacingDifference = idealPaceSpent - actualDiscretionarySpent;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  const handleExampleClick = (example: string) => {
    navigate(`/discover?q=${encodeURIComponent(example)}`);
  };

  const handleTrack = (product: Product) => {
    setProductToWatch(product);
    setIsWatchModalOpen(true);
  };

  const handleBuy = (product: Product) => {
    setSelectedProductForCheckout(product);
  };

  return (
    <PageContainer>
      <div className="space-y-6 pt-2 pb-14">
        
        {/* ========================================================= */}
        {/* 1. EDITORIAL GREETING & STATUS BANNER                     */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DFD5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-semibold text-emerald-800 tracking-wide">
                Spending on track · Pacing well
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold font-heading text-[#2A241F] tracking-tight">
              {getGreeting(user.displayName)}
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-[#7D7164] max-w-2xl leading-relaxed">
              Your spending is pacing ₹{pacingDifference.toLocaleString('en-IN')} ahead of schedule. Three products on your watchlist have dropped in price this week.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAskCompanion()}
              leftIcon={<Sparkles size={14} className="text-[#F08A63]" />}
              className="text-xs font-bold bg-[#192923] hover:bg-[#2A3B34] text-white cursor-pointer shadow-xs"
            >
              Ask Morrow
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setProductToWatch(null);
                setIsWatchModalOpen(true);
              }}
              leftIcon={<Eye size={14} />}
              className="text-xs font-semibold border-[#DCD0C2] hover:bg-[#EFE8DD] text-[#2A241F]"
            >
              Add Price Watch
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. INSPIRATION ROW: 4 ELEVATED METRIC TILES               */}
        {/* ========================================================= */}
        <section aria-label="Core Financial Metrics">
          <FintechMetricCards />
        </section>

        {/* ========================================================= */}
        {/* 3. INSPIRATION HERO GRID: SPEND ANALYSIS + TRANSACTIONS   */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5" aria-label="Cash Flow Analytics & Transactions">
          
          {/* Monthly Spend Analysis (Left 8 Cols) */}
          <div className="lg:col-span-8 bg-[#FAF7F2] rounded-[20px] p-5 sm:p-6 border border-[#EADDCF]/70 shadow-[0_10px_25px_-5px_rgba(180,150,120,0.12),0_2px_6px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-[#2A241F] tracking-tight">
                  Monthly Spend Analysis
                </h2>
                <p className="text-[11px] text-[#8C7D6F]">
                  Discretionary allowance versus actual outflow across 2026
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-3 text-xs font-medium text-[#7D7164]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C89350]" />
                  <span>Budget</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4772F]" />
                  <span>Actual</span>
                </span>
              </div>
            </div>

            {/* Bezier Spline Area Chart */}
            <div className="pt-2">
              <MonthlySpendChart />
            </div>
          </div>

          {/* Recent Transactions (Right 4 Cols) */}
          <div className="lg:col-span-4 bg-[#FAF7F2] rounded-[20px] p-5 sm:p-6 border border-[#EADDCF]/70 shadow-[0_10px_25px_-5px_rgba(180,150,120,0.12),0_2px_6px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <RecentTransactionsList />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. COPILOT MONEY PACING DISCRETIONARY RUNWAY GAUGE        */}
        {/* ========================================================= */}
        <section className="bg-[#241D17] text-[#FAF7F2] rounded-[18px] p-5 sm:p-6 shadow-md border border-[#3E342B]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Gauge & Status */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#D9A566] flex items-center gap-1.5">
                  <Wallet size={14} className="text-[#DE873E]" />
                  <span>Monthly Discretionary Runway</span>
                </span>
                <span className="text-[11px] font-medium text-[#C6B6A5]">
                  Day {currentDay} of {daysInMonth} ({monthProgressPct}% month elapsed)
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <div className="text-3xl lg:text-4xl font-extrabold font-heading tabular-nums text-white tracking-tight">
                  {formatCurrency(discretionary, user.currency)}
                </div>
                <div className="text-xs text-[#EAE0D2]">
                  Pacing <strong className="text-[#D9A566] font-bold">₹{pacingDifference.toLocaleString('en-IN')} ahead</strong> of ideal pace
                </div>
              </div>

              {/* Progress bar with Copilot ideal pace marker */}
              <div className="space-y-1.5 pt-1">
                <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white/60 z-10 rounded-full"
                    style={{ left: `${monthProgressPct}%` }}
                    title={`Ideal pace mark (${monthProgressPct}%)`}
                  />
                  <div
                    className="h-full bg-[#DE873E] rounded-full transition-all duration-500"
                    style={{ width: `${spendingProgressPct}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#A69788]">
                  <span>Spent ₹{actualDiscretionarySpent.toLocaleString('en-IN')}</span>
                  <span>Ideal pace marker ({monthProgressPct}%)</span>
                  <span>Monthly Allowance {formatCurrency(monthlyDiscretionaryAllowance, user.currency)}</span>
                </div>
              </div>
            </div>

            {/* Right: Supporting Breakdown Columns */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
              <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A69788] block">
                  Monthly Income
                </span>
                <div className="text-sm sm:text-base font-bold tabular-nums text-white mt-1">
                  {formatCurrency(financialProfile.monthlyIncome, user.currency)}
                </div>
                <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">Salary Active</span>
              </div>

              <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A69788] block">
                  Fixed Expenses
                </span>
                <div className="text-sm sm:text-base font-bold tabular-nums text-white mt-1">
                  {formatCurrency(financialProfile.essentialExpenses, user.currency)}
                </div>
                <span className="text-[10px] text-[#A69788] block mt-0.5">Rent & Bills</span>
              </div>

              <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A69788] block">
                  Protected SIP
                </span>
                <div className="text-sm sm:text-base font-bold tabular-nums text-white mt-1">
                  {formatCurrency(financialProfile.savingsCommitment, user.currency)}
                </div>
                <span className="text-[10px] text-[#D9A566] font-medium block mt-0.5">Auto-Reserve</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. SHOPPING SEARCH WITH AUTOMATIC AFFORDABILITY FIT       */}
        {/* ========================================================= */}
        <section className="bg-[#FAF7F2] border border-[#EADDCF]/70 rounded-[18px] p-5 sm:p-6 shadow-[0_8px_20px_-4px_rgba(180,150,120,0.1)]">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-bold font-heading text-[#2A241F]">
              Find something worth buying.
            </h2>
            <p className="text-xs text-[#7D7164]">
              Natural-language product search with automatic budget fit assessment
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7D6F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe what you're looking for (e.g. noise-cancelling headphones under ₹25,000)..."
                className="w-full h-12 pl-11 pr-4 bg-white border border-[#E6DFD5] rounded-[10px] text-sm text-[#2A241F] placeholder:text-[#8C7D6F] focus:outline-none focus:border-[#2A241F] focus:ring-2 focus:ring-[#2A241F]/10 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleAskCompanion()}
                leftIcon={<Sparkles size={15} className="text-[#F08A63]" />}
                className="h-12 px-5 text-sm font-semibold border-[#192923] text-[#192923] hover:bg-[#192923]/5 cursor-pointer"
              >
                Ask Morrow
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="h-12 px-7 text-sm font-semibold bg-[#2A241F] hover:bg-[#3D342C] text-[#FAF7F2] cursor-pointer"
              >
                Find Products
              </Button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-2 pt-3 flex-wrap text-xs text-[#7D7164]">
            <span className="text-[11px] font-semibold text-[#2A241F]">Ask companion or search:</span>
            {[
              'Headphones under ₹25,000',
              'A laptop for programming',
              'Running shoes for daily use',
            ].map((eg) => (
              <button
                key={eg}
                type="button"
                onClick={() => handleAskCompanion(eg)}
                className="text-xs px-2.5 py-1 rounded-[6px] bg-white hover:bg-[#EFE8DD] text-[#2A241F] transition-colors cursor-pointer border border-[#E6DFD5] flex items-center gap-1"
                title="Ask Morrow AI Companion"
              >
                <Sparkles size={11} className="text-[#F08A63]" />
                <span>{eg}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. CURATED RECOMMENDATIONS (HERO SHOPPING)                */}
        {/* ========================================================= */}
        <section className="space-y-3.5 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg lg:text-xl font-bold font-heading text-[#2A241F]">
                Curated For You
              </h2>
              <p className="text-xs text-[#7D7164]">
                Personalized picks matched with your verified preferences and discretionary runway
              </p>
            </div>
            <button
              onClick={() => navigate('/discover')}
              className="text-xs font-semibold text-[#2A241F] hover:text-[#C58039] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Explore all</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {recommendations.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onTrack={handleTrack}
                onBuy={handleBuy}
              />
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. ACTIVE PRICE WATCHES & RECENT ORDERS                   */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* Active Price Watches (col 7) */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#EADDCF]/70 rounded-[18px] p-5 shadow-[0_8px_20px_-4px_rgba(180,150,120,0.1)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5]">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-[#2A241F]" />
                <h3 className="text-sm font-bold font-heading text-[#2A241F]">
                  Active Price Watches
                </h3>
              </div>
              <button
                onClick={() => navigate('/price-watch')}
                className="text-xs font-semibold text-[#7D7164] hover:text-[#2A241F]"
              >
                View all ({priceWatches.length})
              </button>
            </div>

            <div className="divide-y divide-[#E6DFD5]">
              {activeWatches.map((w) => {
                const historyPrices = w.priceHistory.map((h) => h.price);
                const drop = w.initialPrice - w.currentPrice;
                return (
                  <div
                    key={w.id}
                    onClick={() => navigate(`/product/${w.productId}`)}
                    className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/70 px-2 rounded-[8px] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={w.product.image}
                        alt={w.product.title}
                        className="w-10 h-10 object-cover rounded-[7px] bg-white border border-[#E6DFD5] flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#2A241F] truncate">
                          {w.product.title}
                        </h4>
                        <span className="text-[11px] text-[#7D7164]">
                          Target: <strong className="text-emerald-700 tabular-nums">{formatCurrency(w.targetPrice, w.currency)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <Sparkline data={historyPrices} width={80} height={22} strokeWidth={1.5} />
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold tabular-nums text-[#2A241F]">
                        {formatCurrency(w.currentPrice, w.currency)}
                      </div>
                      {drop > 0 && (
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          −₹{drop.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders (col 5) */}
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#EADDCF]/70 rounded-[18px] p-5 shadow-[0_8px_20px_-4px_rgba(180,150,120,0.1)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={15} className="text-[#2A241F]" />
                <h3 className="text-sm font-bold font-heading text-[#2A241F]">
                  Recent Purchases
                </h3>
              </div>
              <button
                onClick={() => navigate('/purchases')}
                className="text-xs font-semibold text-[#7D7164] hover:text-[#2A241F]"
              >
                All Orders ({orders.length})
              </button>
            </div>

            <div className="divide-y divide-[#E6DFD5]">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#7D7164] block">
                      {ord.merchant} · {formatDate(ord.createdAt)}
                    </span>
                    <h4 className="text-xs font-bold text-[#2A241F] truncate mt-0.5">
                      {ord.items[0]?.productTitle}
                    </h4>
                    <span className="text-[10px] text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      <span>Captured via PayPal Sandbox</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold tabular-nums text-[#2A241F]">
                      {formatCurrency(ord.totalAmount, ord.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>

      {/* Price Watch Modal */}
      <PriceWatchForm
        open={isWatchModalOpen}
        onClose={() => {
          setIsWatchModalOpen(false);
          setProductToWatch(null);
        }}
        product={productToWatch}
      />

      {/* Sandbox Checkout Modal */}
      <CheckoutModal
        open={!!selectedProductForCheckout}
        onClose={() => setSelectedProductForCheckout(null)}
        product={selectedProductForCheckout}
      />
    </PageContainer>
  );
}
