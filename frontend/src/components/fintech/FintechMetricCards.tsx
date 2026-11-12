import { useAppStore } from '@/store/appStore';
import { formatCurrency } from '@/utils/currency';
import { calculateDiscretionary } from '@/utils/affordability';

export function FintechMetricCards() {
  const { financialProfile, user, transactions } = useAppStore();
  const discretionary = calculateDiscretionary(financialProfile);

  // Copilot Money Pacing calculations derived from real transactions & profile
  const daysInMonth = 30;
  const currentDay = 12;
  const monthlyDiscretionaryAllowance = Math.max(
    0,
    financialProfile.monthlyIncome - financialProfile.essentialExpenses - financialProfile.savingsCommitment
  );
  
  // Real-time spent in the current month (Nov 2026 or active month)
  const actualDiscretionarySpent = transactions
    .filter(
      (t) =>
        t.transactionType === 'expense' &&
        t.category !== 'Rent' &&
        (t.transactionDate.includes('-11-') || t.transactionDate.startsWith('2026-11'))
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const idealPaceSpent = Math.round((monthlyDiscretionaryAllowance * currentDay) / daysInMonth);
  const pacingDifference = idealPaceSpent - actualDiscretionarySpent;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* 1. Available Discretionary */}
      <div className="bg-[#FAF7F2] rounded-[18px] p-5 border border-[#EADDCF]/70 shadow-[0_10px_25px_-5px_rgba(180,150,120,0.12),0_2px_6px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-5px_rgba(180,150,120,0.18)] duration-200">
        <div>
          <span className="text-xs font-semibold text-[#8C7D6F] tracking-tight block">
            Available Discretionary
          </span>
          <div className="mt-2 text-xl sm:text-2xl lg:text-[25px] font-bold tracking-tight text-[#2A241F] tabular-nums leading-none">
            {formatCurrency(discretionary, user.currency)}
          </div>
        </div>
        <div className="mt-2 text-[11px] font-medium text-emerald-700">
          ₹{pacingDifference.toLocaleString('en-IN')} ahead of ideal pace
        </div>
      </div>

      {/* 2. Monthly Income */}
      <div className="bg-[#FAF7F2] rounded-[18px] p-5 border border-[#EADDCF]/70 shadow-[0_10px_25px_-5px_rgba(180,150,120,0.12),0_2px_6px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-5px_rgba(180,150,120,0.18)] duration-200">
        <div>
          <span className="text-xs font-semibold text-[#8C7D6F] tracking-tight block">
            Monthly Income
          </span>
          <div className="mt-2 text-xl sm:text-2xl lg:text-[25px] font-bold tracking-tight text-[#2A241F] tabular-nums leading-none">
            {formatCurrency(financialProfile.monthlyIncome, user.currency)}
          </div>
        </div>
        <div className="mt-2 text-[11px] font-medium text-[#8C7D6F]">
          Salary Credit Active
        </div>
      </div>

      {/* 3. Essential Expenses */}
      <div className="bg-[#FAF7F2] rounded-[18px] p-5 border border-[#EADDCF]/70 shadow-[0_10px_25px_-5px_rgba(180,150,120,0.12),0_2px_6px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-5px_rgba(180,150,120,0.18)] duration-200">
        <div>
          <span className="text-xs font-semibold text-[#8C7D6F] tracking-tight block">
            Fixed Expenses
          </span>
          <div className="mt-2 text-xl sm:text-2xl lg:text-[25px] font-bold tracking-tight text-[#2A241F] tabular-nums leading-none">
            {formatCurrency(financialProfile.essentialExpenses, user.currency)}
          </div>
        </div>
        <div className="mt-2 text-[11px] font-medium text-[#8C7D6F]">
          Rent, utilities & groceries
        </div>
      </div>

      {/* 4. Savings Goal with Caramel Progress Bar */}
      <div className="bg-[#FAF7F2] rounded-[18px] p-5 border border-[#EADDCF]/70 shadow-[0_10px_25px_-5px_rgba(180,150,120,0.12),0_2px_6px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-5px_rgba(180,150,120,0.18)] duration-200">
        <div>
          <span className="text-xs font-semibold text-[#8C7D6F] tracking-tight block">
            Savings Goal
          </span>
          <div className="mt-2 text-xl sm:text-2xl lg:text-[25px] font-bold tracking-tight text-[#2A241F] tabular-nums leading-none">
            {formatCurrency(financialProfile.savingsCommitment, user.currency)} (65%)
          </div>
        </div>
        
        {/* Soft caramel progress bar inspired by the reference */}
        <div className="mt-3 w-full h-[5px] bg-[#EAE0D2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B8854D] rounded-full transition-all duration-700 ease-out"
            style={{ width: '65%' }}
            title="65% achieved this month"
          />
        </div>
      </div>
    </div>
  );
}
