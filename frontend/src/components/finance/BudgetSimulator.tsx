import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { formatCurrency } from '@/utils/currency';
import { assessAffordability, calculateDiscretionary } from '@/utils/affordability';
import { useAppStore } from '@/store/appStore';

export function BudgetSimulator() {
  const { financialProfile, user } = useAppStore();
  const [purchaseAmount, setPurchaseAmount] = useState<string>('8995');
  const [purchaseTitle, setPurchaseTitle] = useState<string>('Noise-Canceling Headphones');

  const cost = parseFloat(purchaseAmount) || 0;
  const assessment = assessAffordability(cost, financialProfile);
  const currentDiscretionary = calculateDiscretionary(financialProfile);

  return (
    <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-5 lg:p-6 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#E9E6DE]">
        <div className="w-8 h-8 rounded-[8px] bg-[#192923] text-[#F08A63] flex items-center justify-center">
          <Calculator size={16} />
        </div>
        <div>
          <h3 className="text-base font-bold font-heading text-[#192923]">Purchase Impact Simulator</h3>
          <p className="text-xs text-[#858A83]">See exactly how an intended purchase impacts your monthly discretionary allowance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Form Inputs */}
        <div className="space-y-4">
          <Input
            label="Item Description"
            value={purchaseTitle}
            onChange={(e) => setPurchaseTitle(e.target.value)}
            placeholder="e.g. Ergonomic Office Chair"
          />
          <Input
            label="Proposed Cost in INR (₹)"
            type="number"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            placeholder="8995"
            min="0"
          />

          <div className="flex gap-2 flex-wrap">
            {[4999, 8995, 19990, 24990].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPurchaseAmount(val.toString())}
                className="px-2.5 py-1 text-xs font-semibold rounded-[6px] bg-[#F6F4EE] hover:bg-[#E9E6DE] text-[#242C27] transition-colors cursor-pointer border border-[#E9E6DE]"
              >
                ₹{val.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Result Card */}
        <div className={`p-5 rounded-[12px] border ${
          assessment.decision === 'COMFORTABLE' ? 'bg-emerald-50/70 border-emerald-200' :
          assessment.decision === 'WITHIN_BUDGET' ? 'bg-emerald-50/50 border-emerald-200' :
          assessment.decision === 'BUDGET_STRAIN' ? 'bg-amber-50/70 border-amber-200' :
          'bg-rose-50/70 border-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#242C27]/70">Affordability Analysis</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              assessment.decision === 'COMFORTABLE' ? 'bg-emerald-200 text-emerald-900' :
              assessment.decision === 'WITHIN_BUDGET' ? 'bg-emerald-200 text-emerald-900' :
              assessment.decision === 'BUDGET_STRAIN' ? 'bg-amber-200 text-amber-900' :
              'bg-rose-200 text-rose-900'
            }`}>
              {assessment.decision.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#242C27]/85">
            <div className="flex justify-between py-1 border-b border-black/5">
              <span>Current Discretionary Runway:</span>
              <span className="font-bold tabular-nums">{formatCurrency(currentDiscretionary, user.currency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/5">
              <span>Proposed Purchase Cost:</span>
              <span className="font-bold tabular-nums text-[#192923]">{formatCurrency(cost, user.currency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/5">
              <span>Remaining Runway Post-Purchase:</span>
              <span className={`font-bold tabular-nums ${assessment.remainingAfterPurchase < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatCurrency(assessment.remainingAfterPurchase, user.currency)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Budget Consumed:</span>
              <span className="font-bold tabular-nums">{assessment.budgetPercentageUsed}%</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#242C27]/80 leading-relaxed font-medium">
            {assessment.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
