import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Utensils, Car, Tv, Home, ArrowDownLeft, 
  CreditCard, ChevronRight, IndianRupee, DollarSign
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import type { Transaction } from '@/types/transaction';

export function RecentTransactionsList() {
  const { transactions, user } = useAppStore();
  const navigate = useNavigate();

  // Pick the top 5 recent transactions
  const recentTxs = transactions.slice(0, 5);

  const getCategoryIcon = (category: string, isIncome: boolean) => {
    if (isIncome) {
      return user.currency === 'INR' 
        ? <IndianRupee size={14} className="text-[#A27B4E]" />
        : <DollarSign size={14} className="text-[#A27B4E]" />;
    }
    switch (category) {
      case 'Shopping':
        return <ShoppingBag size={14} className="text-[#A27B4E]" />;
      case 'Food & Dining':
        return <Utensils size={14} className="text-[#A27B4E]" />;
      case 'Transport':
        return <Car size={14} className="text-[#A27B4E]" />;
      case 'Subscription':
      case 'Entertainment':
        return <Tv size={14} className="text-[#A27B4E]" />;
      case 'Rent':
      case 'Utilities':
        return <Home size={14} className="text-[#A27B4E]" />;
      default:
        return <CreditCard size={14} className="text-[#A27B4E]" />;
    }
  };

  return (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#2A241F] tracking-tight">
          Recent Transactions
        </h3>
        <button
          onClick={() => navigate('/purchases')}
          className="text-xs font-semibold text-[#8C7D6F] hover:text-[#2A241F] transition-colors cursor-pointer flex items-center gap-0.5"
        >
          <span>View all</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Transaction Rows */}
      {recentTxs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#8C7D6F] bg-[#FAF4EB]/60 rounded-[14px] border border-dashed border-[#E8DFD3] my-auto">
          <ShoppingBag size={22} className="opacity-40 mb-1.5 text-[#B8854D]" />
          <span className="text-xs font-semibold text-[#2A241F]">No transactions yet</span>
          <span className="text-[11px] text-[#8C7D6F] mt-0.5 max-w-[180px]">
            New purchases and credits will appear here automatically.
          </span>
        </div>
      ) : (
        <div className="space-y-2 flex-1 flex flex-col justify-between">
          {recentTxs.map((tx: Transaction) => {
            const isIncome = tx.transactionType === 'income';
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between group py-2 px-2 rounded-[12px] hover:bg-[#FAF4EB] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Warm Circular Badge */}
                  <div className="w-8 h-8 rounded-full bg-[#EFE4D6] flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] group-hover:scale-105 transition-transform">
                    {getCategoryIcon(tx.category, isIncome)}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#2A241F] truncate leading-tight group-hover:text-[#C58039] transition-colors">
                      {tx.description}
                    </div>
                    <div className="text-[11px] text-[#9A8D80] leading-tight mt-0.5 truncate">
                      {formatDate(tx.transactionDate)} · {tx.merchant}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      isIncome ? 'text-emerald-700' : 'text-[#2A241F]'
                    }`}
                  >
                    {isIncome ? '+' : '−'}
                    {formatCurrency(tx.amount, user.currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
