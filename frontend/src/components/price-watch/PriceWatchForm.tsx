import { useState } from 'react';
import { Bot, Bell, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { Product } from '@/types/product';
import type { PriceWatch, PurchaseMode } from '@/types/priceWatch';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAppStore } from '@/store/appStore';
import { DEMO_PRODUCTS } from '@/data/demoData';
import { formatCurrency } from '@/utils/currency';

export interface PriceWatchFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function PriceWatchForm({ open, onClose, product }: PriceWatchFormProps) {
  const { addPriceWatch, user } = useAppStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    product?.id || DEMO_PRODUCTS[0].id
  );
  const selectedProduct = DEMO_PRODUCTS.find(p => p.id === (product?.id || selectedProductId)) || DEMO_PRODUCTS[0];

  const [targetPrice, setTargetPrice] = useState<string>(
    Math.round(selectedProduct.price * 0.9).toString()
  );
  const [maxTotalPrice, setMaxTotalPrice] = useState<string>(
    Math.round(selectedProduct.price * 0.95).toString()
  );
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('notify');
  const [affordabilityRequired, setAffordabilityRequired] = useState(true);
  const [sellerRequirement, setSellerRequirement] = useState('Authorized Merchants (Rating ≥ 4.5)');
  const [autoBuyAuthorized, setAutoBuyAuthorized] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetPrice) || selectedProduct.price;
    const maxTotal = parseFloat(maxTotalPrice) || target * 1.05;

    const newWatch: PriceWatch = {
      id: 'pw_' + Date.now(),
      productId: selectedProduct.id,
      product: selectedProduct,
      targetPrice: target,
      maximumTotalPrice: maxTotal,
      currency: selectedProduct.currency,
      purchaseMode,
      sellerRequirement,
      affordabilityRequired,
      status: 'active',
      initialPrice: selectedProduct.price,
      currentPrice: selectedProduct.price,
      priceHistory: [
        {
          id: 'po_' + Date.now(),
          productId: selectedProduct.id,
          price: selectedProduct.price,
          currency: selectedProduct.currency,
          merchant: selectedProduct.merchant,
          observedAt: new Date().toISOString(),
        },
      ],
      rule: purchaseMode === 'auto_purchase' ? {
        id: 'rule_' + Date.now(),
        priceWatchId: 'pw_' + Date.now(),
        maxQuantity: 1,
        authorized: autoBuyAuthorized,
        authorizationNote: 'Sandbox purchase explicitly authorized by user in Demo Mode',
      } : undefined,
      lastCheckedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    addPriceWatch(newWatch);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Configure Price Watch" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product selector if not fixed */}
        {!product && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#192923] mb-1.5">
              Select Product to Track
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = DEMO_PRODUCTS.find(item => item.id === e.target.value);
                if (p) {
                  setTargetPrice(Math.round(p.price * 0.9).toString());
                  setMaxTotalPrice(Math.round(p.price * 0.95).toString());
                }
              }}
              className="w-full h-11 px-4 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[10px] text-sm text-[#192923] focus:outline-none focus:border-[#192923]"
            >
              {DEMO_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {formatCurrency(p.price, p.currency)} ({p.merchant})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected Product Banner */}
        <div className="flex items-center gap-3 p-3 bg-[#F6F4EE] rounded-[12px] border border-[#E9E6DE]">
          <img src={selectedProduct.image} alt={selectedProduct.title} className="w-12 h-12 object-cover rounded-[8px]" />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-[#192923] truncate">{selectedProduct.title}</h4>
            <div className="text-xs text-[#858A83]">
              Current Retail: <strong className="text-[#192923]">{formatCurrency(selectedProduct.price, selectedProduct.currency)}</strong> at {selectedProduct.merchant}
            </div>
          </div>
        </div>

        {/* Price Targets in INR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Target Trigger Price (₹)"
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            required
            hint="Alert or execute when price reaches or drops below this."
          />
          <Input
            label="Max Total Checkout Cap (₹)"
            type="number"
            value={maxTotalPrice}
            onChange={(e) => setMaxTotalPrice(e.target.value)}
            required
            hint="Maximum allowable total including delivery charges."
          />
        </div>

        {/* Purchase Mode Choice */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#192923] mb-2">
            Execution Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                mode: 'notify' as const,
                title: 'Notify Me',
                desc: 'Alert when price drops below target',
                icon: Bell,
              },
              {
                mode: 'prepare_checkout' as const,
                title: 'Pre-checkout',
                desc: 'Prepare cart and prompt for 1-click confirmation',
                icon: ShoppingBag,
              },
              {
                mode: 'auto_purchase' as const,
                title: 'Agentic Auto-Buy',
                desc: 'Execute sandbox order when all conditions pass',
                icon: Bot,
              },
            ].map(({ mode, title, desc, icon: Icon }) => (
              <div
                key={mode}
                onClick={() => setPurchaseMode(mode)}
                className={`p-3 rounded-[12px] border cursor-pointer transition-all ${
                  purchaseMode === mode
                    ? 'border-[#192923] bg-[#192923] text-white shadow-xs'
                    : 'border-[#E9E6DE] bg-white text-[#242C27] hover:border-[#192923]/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={purchaseMode === mode ? 'text-[#F08A63]' : 'text-[#858A83]'} />
                  <span className="text-xs font-bold">{title}</span>
                </div>
                <p className={`text-[11px] leading-snug ${purchaseMode === mode ? 'text-white/70' : 'text-[#858A83]'}`}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-buy authorization guard */}
        {purchaseMode === 'auto_purchase' && (
          <div className="p-4 bg-[#F08A63]/10 border border-[#F08A63]/30 rounded-[12px] space-y-2.5">
            <div className="flex items-start gap-2">
              <ShieldCheck size={18} className="text-[#192923] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-[#192923]">Sandbox Demonstration Guard</h5>
                <p className="text-[11px] text-[#242C27] leading-relaxed mt-0.5">
                  Morrow operates strictly via PayPal Sandbox in this demo. No real money or bank accounts will be charged.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-xs font-medium text-[#192923] cursor-pointer">
              <input
                type="checkbox"
                checked={autoBuyAuthorized}
                onChange={(e) => setAutoBuyAuthorized(e.target.checked)}
                className="w-4 h-4 rounded text-[#192923]"
              />
              <span>I explicitly authorize Morrow to execute sandbox mock purchases when conditions are met.</span>
            </label>
          </div>
        )}

        {/* Affordability check toggle */}
        <div className="flex items-center justify-between p-3.5 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[12px]">
          <div>
            <div className="text-xs font-bold text-[#192923]">Verify Discretionary Budget Before Triggering</div>
            <div className="text-[11px] text-[#858A83]">Ensures purchase will not compromise savings or fixed commitments</div>
          </div>
          <input
            type="checkbox"
            checked={affordabilityRequired}
            onChange={(e) => setAffordabilityRequired(e.target.checked)}
            className="w-4 h-4 rounded text-[#192923]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={purchaseMode === 'auto_purchase' && !autoBuyAuthorized}
            className="font-semibold"
          >
            Start Price Watch
          </Button>
        </div>
      </form>
    </Modal>
  );
}
