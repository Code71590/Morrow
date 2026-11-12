import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, ShieldCheck, Eye, ShoppingCart, 
  Sparkles, Store, Truck, ArrowRight
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PriceHistoryChart } from '@/components/price-watch/PriceHistoryChart';
import { PriceWatchForm } from '@/components/price-watch/PriceWatchForm';
import { CheckoutModal } from '@/components/shopping/CheckoutModal';
import { ProductCard } from '@/components/shopping/ProductCard';
import { formatCurrency } from '@/utils/currency';
import { assessAffordability, calculateDiscretionary } from '@/utils/affordability';
import { useAppStore } from '@/store/appStore';
import { DEMO_PRODUCTS } from '@/data/demoData';

const COLOR_VARIANTS = [
  { name: 'Matte Black', hex: '#192923' },
  { name: 'Warm Chalk', hex: '#F6F4EE' },
  { name: 'Forest Slate', hex: '#303933' },
];

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { financialProfile, user, priceWatches } = useAppStore();

  const [selectedVariant, setSelectedVariant] = useState(COLOR_VARIANTS[0].name);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Find product by id or fallback to first product
  const product = DEMO_PRODUCTS.find((p) => p.id === id) || DEMO_PRODUCTS[0];
  const isTracked = priceWatches.some((pw) => pw.productId === product.id && pw.status === 'active');
  const existingWatch = priceWatches.find((pw) => pw.productId === product.id);

  // Financial Affordability Analysis
  const affordability = assessAffordability(product.price, financialProfile);
  const discretionary = calculateDiscretionary(financialProfile);

  // Price history from existing watch or generated observations in INR
  const priceHistory = existingWatch?.priceHistory && existingWatch.priceHistory.length > 0
    ? existingWatch.priceHistory
    : [
        { id: 'h1', productId: product.id, price: Math.round(product.price * 1.18), currency: product.currency, merchant: product.merchant, observedAt: '2026-10-01T10:00:00Z' },
        { id: 'h2', productId: product.id, price: Math.round(product.price * 1.10), currency: product.currency, merchant: product.merchant, observedAt: '2026-10-18T10:00:00Z' },
        { id: 'h3', productId: product.id, price: Math.round(product.price * 1.05), currency: product.currency, merchant: product.merchant, observedAt: '2026-11-01T10:00:00Z' },
        { id: 'h4', productId: product.id, price: product.price, currency: product.currency, merchant: product.merchant, observedAt: '2026-11-12T10:00:00Z' },
      ];

  // Live merchant comparison in INR
  const merchantOffers = [
    { name: product.merchant, price: product.price, inStock: true, best: true },
    { name: 'Croma Retail', price: Math.round(product.price * 1.04), inStock: true, best: false },
    { name: 'Reliance Digital', price: Math.round(product.price * 1.07), inStock: true, best: false },
  ];

  return (
    <PageContainer>
      <div className="space-y-8 pt-1 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs text-[#858A83] pb-2 border-b border-[#E9E6DE]">
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center gap-1.5 font-semibold text-[#858A83] hover:text-[#192923] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>
          <span>Catalog / {product.category} / <strong className="text-[#192923]">{product.brand}</strong></span>
        </div>

        {/* 2-Column Editorial Ecommerce Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Dominant Photography & Historical Chart (col 6) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="relative aspect-square rounded-[16px] overflow-hidden bg-[#F6F4EE] border border-[#E9E6DE] p-8 lg:p-12 flex items-center justify-center shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain max-h-[440px] drop-shadow-sm transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="persimmon" size="sm" className="shadow-xs font-semibold">
                  <Sparkles size={11} /> Preference Verified
                </Badge>
              </div>
            </div>

            {/* Merchant Guarantee Pills */}
            <div className="flex items-center justify-between text-xs text-[#858A83] px-1">
              <span className="flex items-center gap-1.5">
                <Store size={14} className="text-[#192923]" /> Merchant: <strong className="text-[#192923]">{product.merchant}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#192923]" /> Free Express Delivery
              </span>
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <strong className="text-[#192923]">{product.rating}</strong> ({product.reviewCount?.toLocaleString()})
              </span>
            </div>

            {/* Price Movement Wave Chart */}
            <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-4.5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-heading text-[#192923]">
                  Historical Price Trend
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Lowest recorded this quarter
                </span>
              </div>
              <PriceHistoryChart
                history={priceHistory}
                targetPrice={existingWatch ? existingWatch.targetPrice : Math.round(product.price * 0.9)}
                currency={product.currency}
              />
            </div>
          </div>

          {/* Right Column: Purchasing Info, Affordability & Actions (col 6) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
                {product.brand} · {product.category}
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold font-heading text-[#192923] leading-tight">
                {product.title}
              </h1>

              {/* Price Display */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl lg:text-4xl font-extrabold tabular-nums text-[#192923] font-heading">
                  {formatCurrency(product.price, product.currency)}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Verified Best Price
                </span>
              </div>
            </div>

            {/* Editorial Description */}
            <p className="text-xs text-[#858A83] leading-relaxed">
              {product.description}
            </p>

            {/* Color Finish Variant Selector */}
            <div className="pt-2 border-t border-[#E9E6DE]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#192923]">Finish:</span>
                <span className="text-[#858A83]">{selectedVariant}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {COLOR_VARIANTS.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`h-9 px-3 rounded-[9px] text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                      selectedVariant === v.name
                        ? 'border-[#192923] bg-white text-[#192923] font-bold shadow-xs ring-1 ring-[#192923]'
                        : 'border-[#E9E6DE] bg-[#F6F4EE] text-[#858A83] hover:text-[#192923]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: v.hex }}
                    />
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Merchant Price Comparison */}
            <div className="bg-[#F6F4EE] rounded-[12px] p-3.5 border border-[#E9E6DE] text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block">
                Live Merchant Price Check
              </span>
              <div className="space-y-1.5">
                {merchantOffers.map((offer) => (
                  <div key={offer.name} className="flex items-center justify-between">
                    <span className="text-[#242C27] font-medium flex items-center gap-1.5">
                      {offer.best && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                      {offer.name}
                    </span>
                    <span className="font-bold tabular-nums text-[#192923]">
                      {formatCurrency(offer.price, product.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Affordability Assessment Card (Reassuring, Distinct, Not Alarming) */}
            <div className="p-4.5 rounded-[14px] bg-white border border-[#E9E6DE] shadow-[0_6px_24px_rgba(25,41,35,0.045)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#192923] flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-700" />
                  Financial Assessment
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  affordability.decision === 'COMFORTABLE' ? 'bg-emerald-100 text-emerald-800' :
                  affordability.decision === 'WITHIN_BUDGET' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-amber-100 text-amber-900'
                }`}>
                  {affordability.decision.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-[#242C27] leading-relaxed">
                {affordability.explanation}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E9E6DE] text-xs">
                <div>
                  <span className="text-[#858A83] block text-[10px] uppercase font-bold">Current Discretionary</span>
                  <span className="font-bold tabular-nums text-[#192923] text-sm">
                    {formatCurrency(discretionary, user.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[#858A83] block text-[10px] uppercase font-bold">Post-Purchase Runway</span>
                  <span className={`font-bold tabular-nums text-sm ${affordability.remainingAfterPurchase < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {formatCurrency(affordability.remainingAfterPurchase, user.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action in Soft Persimmon & Quiet Secondary Action */}
            <div className="space-y-2.5 pt-1">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
                leftIcon={<ShoppingCart size={17} />}
                className="w-full h-12 text-sm font-bold shadow-xs"
              >
                Buy Now with PayPal Sandbox
              </Button>

              <Button
                variant="outline"
                size="default"
                onClick={() => setIsWatchModalOpen(true)}
                leftIcon={<Eye size={15} />}
                className={`w-full h-11 text-xs font-medium ${isTracked ? 'border-[#F08A63] bg-[#F08A63]/10 text-[#E27952]' : ''}`}
              >
                {isTracked ? 'Update Price Watch Rules' : 'Add to Price Watch'}
              </Button>
            </div>

            {/* Minimal Product Specifications */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="pt-3 border-t border-[#E9E6DE]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#858A83] mb-2.5">
                  Specifications
                </h3>
                <div className="divide-y divide-[#E9E6DE] text-xs">
                  {product.attributes.map((attr) => (
                    <div key={attr.name} className="py-2 flex justify-between">
                      <span className="text-[#858A83]">{attr.name}</span>
                      <span className="font-semibold text-[#242C27]">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Watch Modal */}
      <PriceWatchForm
        open={isWatchModalOpen}
        onClose={() => setIsWatchModalOpen(false)}
        product={product}
      />

      {/* Sandbox Checkout Modal */}
      <CheckoutModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={product}
      />
    </PageContainer>
  );
}
