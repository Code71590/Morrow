import { useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import { DEMO_MONTHLY_SUMMARIES, DEMO_BUDGETS } from '@/data/demoData';
import { useAppStore } from '@/store/appStore';
import { formatCurrency } from '@/utils/currency';
import type { Transaction } from '@/types/transaction';
import { Filter } from 'lucide-react';

export function SpendingCharts({
  selectedCategory,
  selectedTransactions = [],
}: {
  selectedCategory?: string | null;
  selectedTransactions?: Transaction[];
}) {
  const { user, transactions } = useAppStore();

  const isFiltered = selectedTransactions.length > 0;

  // Monthly Cash Flow Chart Options
  const monthlyTrendOptions: any = useMemo(() => {
    return {
      theme: {
        palette: {
          fills: ['#19231F', '#C8F169'],
          strokes: ['#19231F', '#9EC644'],
        },
        baseTheme: 'ag-default',
      },
      data: DEMO_MONTHLY_SUMMARIES.map(s => ({
        month: s.monthName.split(' ')[0],
        Income: s.totalIncome,
        Expenses: s.totalExpenses,
      })).reverse(),
      series: [
        {
          type: 'bar',
          xKey: 'month',
          yKey: 'Income',
          yName: 'Income Inflow',
          cornerRadius: 4,
        },
        {
          type: 'bar',
          xKey: 'month',
          yKey: 'Expenses',
          yName: 'Expenses Outflow',
          cornerRadius: 4,
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          line: { stroke: '#E4E3DC' },
        },
        {
          type: 'number',
          position: 'left',
          line: { stroke: '#E4E3DC' },
          label: {
            formatter: (params: any) => `$${params.value?.toLocaleString()}`,
          },
        },
      ],
      legend: {
        position: 'top',
        spacing: 16,
      },
    };
  }, []);

  // Category Expenses Options: reacts dynamically if user selected rows in AG Grid!
  const categoryData = useMemo(() => {
    if (isFiltered) {
      const expenses = selectedTransactions.filter(t => t.transactionType === 'expense');
      const catMap: Record<string, number> = {};
      expenses.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });
      return Object.entries(catMap).map(([category, amount]) => ({
        category,
        amount,
      }));
    }

    return DEMO_BUDGETS.map(b => ({
      category: b.category,
      amount: b.spent,
    }));
  }, [isFiltered, selectedTransactions]);

  const categoryOptions: any = useMemo(() => {
    return {
      theme: {
        palette: {
          fills: ['#19231F', '#2C3D36', '#526B60', '#8B8A84', '#C8F169', '#E4E3DC'],
        },
      },
      data: categoryData.length > 0 ? categoryData : [{ category: 'None', amount: 1 }],
      series: [
        {
          type: 'donut',
          calloutLabelKey: 'category',
          angleKey: 'amount',
          innerRadiusRatio: 0.62,
          strokeWidth: 2,
          stroke: '#F7F6F1',
        },
      ],
      legend: {
        position: 'bottom',
        spacing: 12,
      },
    };
  }, [categoryData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Cash Flow Comparison */}
      <div className="bg-[#F7F6F1] border border-[#E4E3DC] rounded-[16px] p-5 lg:p-6 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold font-heading text-[#19231F]">
              Cash Flow Trend
            </h3>
            <p className="text-xs text-[#8B8A84]">
              3-month historical inflow vs outflow comparison
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#8B8A84] px-2.5 py-1 rounded-full bg-[#EFEDE6]">
            Copilot Pacing Model
          </span>
        </div>
        <div className="h-64 w-full">
          <AgCharts options={monthlyTrendOptions} />
        </div>
      </div>

      {/* Spending by Category Donut */}
      <div className="bg-[#F7F6F1] border border-[#E4E3DC] rounded-[16px] p-5 lg:p-6 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold font-heading text-[#19231F]">
              Category Allocation
            </h3>
            <p className="text-xs text-[#8B8A84]">
              {isFiltered
                ? `Filtered by ${selectedTransactions.length} AG Grid selection(s)`
                : 'Current monthly discretionary and essential breakdown'}
            </p>
          </div>
          {isFiltered && (
            <span className="text-[11px] font-bold text-[#19231F] px-2.5 py-1 rounded-full bg-[#C8F169] flex items-center gap-1 shadow-xs">
              <Filter size={11} /> Linked to Selection
            </span>
          )}
        </div>
        <div className="h-64 w-full">
          <AgCharts options={categoryOptions} />
        </div>
      </div>
    </div>
  );
}
