import { TrendingUp, Wallet, PiggyBank, CalendarClock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { formatCurrency } from '@/utils/currency';
import { calculateDiscretionary } from '@/utils/affordability';
import { useAppStore } from '@/store/appStore';

export function FinancialSummary() {
  const { financialProfile, user } = useAppStore();
  const discretionary = calculateDiscretionary(financialProfile);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Discretionary Budget */}
      <Card padding="md" className="border-l-4 border-l-[#C8F169] bg-[#F7F6F1]">
        <div className="flex items-center justify-between text-[#8B8A84] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Discretionary Budget</span>
          <Wallet size={16} className="text-[#19231F]" />
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-[#19231F]">
          {formatCurrency(discretionary, user.currency)}
        </div>
        <p className="mt-1.5 text-xs text-[#8B8A84]">
          Safe to spend on non-essentials this month
        </p>
      </Card>

      {/* Monthly Income */}
      <Card padding="md" className="bg-[#F7F6F1]">
        <div className="flex items-center justify-between text-[#8B8A84] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Monthly Income</span>
          <TrendingUp size={16} className="text-emerald-600" />
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-[#19231F]">
          {formatCurrency(financialProfile.monthlyIncome, user.currency)}
        </div>
        <p className="mt-1.5 text-xs text-[#8B8A84]">
          Confirmed monthly deposit
        </p>
      </Card>

      {/* Fixed Commitments */}
      <Card padding="md" className="bg-[#F7F6F1]">
        <div className="flex items-center justify-between text-[#8B8A84] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Fixed Commitments</span>
          <CalendarClock size={16} className="text-amber-600" />
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-[#19231F]">
          {formatCurrency(financialProfile.essentialExpenses + financialProfile.upcomingCommitments, user.currency)}
        </div>
        <p className="mt-1.5 text-xs text-[#8B8A84]">
          Rent, utilities & scheduled bills
        </p>
      </Card>

      {/* Savings Allocation */}
      <Card padding="md" className="bg-[#F7F6F1]">
        <div className="flex items-center justify-between text-[#8B8A84] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Savings & Reserve</span>
          <PiggyBank size={16} className="text-sky-600" />
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-[#19231F]">
          {formatCurrency(financialProfile.savingsCommitment + financialProfile.safetyReserve, user.currency)}
        </div>
        <p className="mt-1.5 text-xs text-[#8B8A84]">
          Protected emergency fund & targets
        </p>
      </Card>
    </div>
  );
}

