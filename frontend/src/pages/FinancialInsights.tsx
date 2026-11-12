import { useState, useMemo } from 'react';
import { 
  BarChart3, ArrowUpRight, ShieldCheck, Wallet, 
  TrendingDown, TrendingUp, Sparkles, Download, ArrowDownLeft
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TransactionGrid } from '@/components/finance/TransactionGrid';
import { CashFlowChart } from '@/components/finance/CashFlowChart';
import { BudgetSimulator } from '@/components/finance/BudgetSimulator';
import { useAppStore } from '@/store/appStore';
import { DEMO_BUDGETS, DEMO_MONTHLY_SUMMARIES } from '@/data/demoData';
import { formatCurrency } from '@/utils/currency';
import { calculateDiscretionary } from '@/utils/affordability';
import type { Transaction } from '@/types/transaction';

export function FinancialInsights() {
  const { user, financialProfile, transactions } = useAppStore();
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [timeframe, setTimeframe] = useState<'3months' | 'current' | 'ytd'>('3months');

  const discretionary = calculateDiscretionary(financialProfile);

  // Copilot Money Pacing calculation in INR
  const daysInMonth = 30;
  const currentDay = 12;
  const monthProgressPct = Math.round((currentDay / daysInMonth) * 100);
  const monthlyDiscretionaryBudget = 22545;
  const actualDiscretionarySpent = 4995;
  const spendingProgressPct = Math.min(100, Math.round((actualDiscretionarySpent / monthlyDiscretionaryBudget) * 100));
  const idealPaceSpent = Math.round((monthlyDiscretionaryBudget * currentDay) / daysInMonth);
  const pacingDifference = idealPaceSpent - actualDiscretionarySpent;

  // Multi-month summary calculations in INR
  const totalInflow = DEMO_MONTHLY_SUMMARIES.reduce((acc, s) => acc + s.totalIncome, 0);
  const totalOutflow = DEMO_MONTHLY_SUMMARIES.reduce((acc, s) => acc + s.totalExpenses, 0);
  const netInflow = totalInflow - totalOutflow;
  const savingsRate = Math.round((netInflow / totalInflow) * 100);

  // Selected or overall stats for ledger summary
  const largestExpense = useMemo(() => {
    const expenses = transactions.filter(t => t.transactionType === 'expense');
    return expenses.reduce((max, t) => t.amount > max ? t.amount : max, 0);
  }, [transactions]);

  const selectedTotal = useMemo(() => {
    return selectedTransactions.reduce((acc, t) => t.transactionType === 'expense' ? acc + t.amount : acc, 0);
  }, [selectedTransactions]);

  return (
    <PageContainer
      title="Financial Insights"
      subtitle="Structured cash flow analytics, Copilot spending velocity, and AG Grid transaction ledger workspace."
      actions={
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-[10px] border border-[#E9E6DE]">
          {[
            { id: '3months', label: 'Last 3 Months' },
            { id: 'current', label: 'This Month' },
            { id: 'ytd', label: 'YTD' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as any)}
              className={`px-3 py-1.5 rounded-[7px] text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-[#192923] text-white shadow-xs'
                  : 'text-[#858A83] hover:text-[#192923]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-6 pt-1 pb-12">
        {/* Top Cash Flow Wave Chart & Connected Summary Strip */}
        <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-5 lg:p-6 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E9E6DE]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#858A83] uppercase tracking-wider mb-0.5">
                <span>Reports</span>
                <span>/</span>
                <span className="text-[#192923] font-bold">Liquidity Wave</span>
              </div>
              <h2 className="text-base font-bold font-heading text-[#192923]">
                Cash Flow Overview
              </h2>
            </div>
            <span className="text-xs text-emerald-800 font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Copilot Ideal Pacing: +₹{pacingDifference.toLocaleString('en-IN')} Buffer
            </span>
          </div>

          {/* Smooth Bezier Spline Chart */}
          <CashFlowChart />

          {/* 4 Connected Summary Metrics (Restrained Neutrals + Deep Forest) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-5 mt-4 border-t border-[#E9E6DE]">
            <div className="p-3.5 bg-[#F6F4EE] rounded-[10px] border border-[#E9E6DE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
                Total Inflow
              </span>
              <div className="text-xl font-extrabold tabular-nums text-emerald-800 font-heading">
                +{formatCurrency(totalInflow, user.currency)}
              </div>
              <span className="text-[10px] text-[#858A83] mt-0.5 block">Across 3-month period</span>
            </div>

            <div className="p-3.5 bg-[#F6F4EE] rounded-[10px] border border-[#E9E6DE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
                Total Outflow
              </span>
              <div className="text-xl font-extrabold tabular-nums text-[#192923] font-heading">
                −{formatCurrency(totalOutflow, user.currency)}
              </div>
              <span className="text-[10px] text-[#858A83] mt-0.5 block">Fixed & discretionary</span>
            </div>

            <div className="p-3.5 bg-[#F6F4EE] rounded-[10px] border border-[#E9E6DE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
                Net Savings Buffer
              </span>
              <div className="text-xl font-extrabold tabular-nums text-[#192923] font-heading">
                +{formatCurrency(netInflow, user.currency)}
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-0.5 block">Positive runway</span>
            </div>

            <div className="p-3.5 bg-[#192923] text-white rounded-[10px] border border-[#303933]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F08A63] block mb-1">
                Savings Rate
              </span>
              <div className="text-xl font-extrabold tabular-nums text-white font-heading">
                {savingsRate}%
              </div>
              <span className="text-[10px] text-white/60 mt-0.5 block">Target 20% achieved</span>
            </div>
          </div>
        </div>

        {/* Copilot Money Spending Pace Gauge */}
        <div className="bg-[#192923] text-white rounded-[14px] p-5 lg:p-6 border border-[#303933] shadow-[0_6px_24px_rgba(25,41,35,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F08A63] flex items-center gap-1.5">
                <Wallet size={14} />
                <span>Monthly Discretionary Runway</span>
              </span>
              <div className="text-2xl font-extrabold tabular-nums text-white mt-1 font-heading">
                {formatCurrency(discretionary, user.currency)} Remaining Safe to Spend
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-white/80">
                Pacing <strong className="text-[#F08A63]">₹{pacingDifference.toLocaleString('en-IN')} ahead</strong> of ideal pace
              </span>
              <div className="text-[11px] text-white/50">Day {currentDay} of {daysInMonth} ({monthProgressPct}% month elapsed)</div>
            </div>
          </div>

          <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-1 bg-white/50 z-10 rounded-full"
              style={{ left: `${monthProgressPct}%` }}
              title={`Ideal pace mark (${monthProgressPct}%)`}
            />
            <div
              className="h-full bg-[#F08A63] rounded-full transition-all duration-500"
              style={{ width: `${spendingProgressPct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-white/50 mt-1.5">
            <span>Start of Month</span>
            <span>Ideal pace marker ({monthProgressPct}%)</span>
            <span>Month-end Allowance ({formatCurrency(monthlyDiscretionaryBudget, user.currency)})</span>
          </div>
        </div>

        {/* Category Budget Progress Tracking Rows */}
        <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#E9E6DE]">
            <div>
              <h2 className="text-sm font-bold font-heading text-[#192923]">
                Discretionary & Essential Categories
              </h2>
              <p className="text-xs text-[#858A83]">
                Current month expenditure vs authorized spending thresholds
              </p>
            </div>
            <span className="text-xs font-semibold text-[#858A83]">November 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DEMO_BUDGETS.map((b) => {
              const percent = Math.min(100, Math.round((b.spent / b.monthlyLimit) * 100));
              const isOver = b.spent > b.monthlyLimit;
              const isNear = percent >= 80;

              return (
                <div key={b.id} className="bg-[#F6F4EE] border border-[#E9E6DE] rounded-[10px] p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#192923]">{b.category}</span>
                    <span className={`text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full ${
                      isOver ? 'bg-rose-100 text-rose-800' :
                      isNear ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {percent}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2 text-xs text-[#858A83]">
                    <span>
                      Spent <strong className="text-[#192923] tabular-nums">{formatCurrency(b.spent, b.currency)}</strong>
                    </span>
                    <span>
                      Limit <span className="tabular-nums">{formatCurrency(b.monthlyLimit, b.currency)}</span>
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#E9E6DE] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-rose-500' : isNear ? 'bg-[#F08A63]' : 'bg-[#192923]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purchase Simulator Component */}
        <BudgetSimulator />

        {/* AG Grid Transaction Workspace (Image 10 & 6 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main AG Grid Workspace (col 9) */}
          <div className="lg:col-span-9 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-base font-bold font-heading text-[#192923] flex items-center gap-2">
                  <span>Transactions Ledger</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white text-[#192923] font-semibold border border-[#E9E6DE]">
                    AG Grid Community
                  </span>
                </h2>
                <p className="text-xs text-[#858A83]">
                  Interactive financial ledger with column sorting, live filtering, multi-row audit, and CSV export
                </p>
              </div>
            </div>

            <TransactionGrid
              onSelectTransactions={setSelectedTransactions}
            />
          </div>

          {/* Ledger Summary Sidebar (col 3) */}
          <div className="lg:col-span-3 bg-white border border-[#E9E6DE] rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)] space-y-4">
            <div className="pb-2.5 border-b border-[#E9E6DE]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#192923]">
                Ledger Summary
              </h3>
              <span className="text-[11px] text-[#858A83]">Audited demo transactions</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E9E6DE]/60">
                <span className="text-[#858A83]">Total Rows:</span>
                <span className="font-bold tabular-nums text-[#192923]">{transactions.length} entries</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E9E6DE]/60">
                <span className="text-[#858A83]">Largest Outflow:</span>
                <span className="font-bold tabular-nums text-[#192923]">−{formatCurrency(largestExpense, user.currency)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E9E6DE]/60">
                <span className="text-[#858A83]">Active Currency:</span>
                <span className="font-bold text-[#192923]">{user.currency} (₹)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E9E6DE]/60">
                <span className="text-[#858A83]">Selected Rows:</span>
                <span className="font-bold tabular-nums text-[#192923]">{selectedTransactions.length}</span>
              </div>
              {selectedTransactions.length > 0 && (
                <div className="flex justify-between py-1 bg-[#F6F4EE] p-2 rounded-[6px] border border-[#E9E6DE]">
                  <span className="text-[#858A83] font-semibold">Selected Sum:</span>
                  <span className="font-extrabold tabular-nums text-[#192923]">
                    {formatCurrency(selectedTotal, user.currency)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 text-[11px] text-[#858A83] leading-relaxed border-t border-[#E9E6DE]">
              <p>Tip: Click any row or use checkboxes in the AG Grid to calculate grouped expenditure sums.</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
