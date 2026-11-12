import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { formatCurrency } from '@/utils/currency';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function MonthlySpendChart() {
  const { transactions, financialProfile, user } = useAppStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const width = 640;
  const height = 220;
  const padLeft = 36;
  const padRight = 16;
  const padBottom = 26;
  const padTop = 16;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Monthly discretionary budget allowance
  const monthlyBudget = Math.max(
    0,
    financialProfile.monthlyIncome - financialProfile.essentialExpenses - financialProfile.savingsCommitment
  );

  // Derive dynamic monthly data from real transactions in appStore
  const currentYear = 2026;
  const monthlyData = MONTH_NAMES.map((month, idx) => {
    const monthNumStr = String(idx + 1).padStart(2, '0');

    // Sum actual expense transactions for this month (excluding rent which is fixed essentials)
    const monthExpenses = transactions
      .filter((tx) => {
        if (tx.transactionType !== 'expense') return false;
        if (tx.category === 'Rent') return false;
        const txDate = tx.transactionDate || '';
        // Matches e.g. "2026-11-05" or "-11-"
        return txDate.includes(`-${monthNumStr}-`) || txDate.startsWith(`${currentYear}-${monthNumStr}`);
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      month,
      budgetAmount: monthlyBudget > 0 ? monthlyBudget : 22000,
      spendAmount: monthExpenses, // If starting an account with no transactions, starts at 0!
    };
  });

  // Calculate scaling ceiling
  const maxSpendOrBudget = Math.max(
    ...monthlyData.map((d) => Math.max(d.budgetAmount, d.spendAmount)),
    monthlyBudget,
    1000
  );
  const ceiling = maxSpendOrBudget * 1.15;

  // Map financial values to SVG 0..50 vertical scale
  const toSvgScale = (amt: number) => {
    if (amt <= 0) return 0;
    return Math.min(50, Math.max(0, (amt / ceiling) * 46));
  };

  const getY = (val: number) => padTop + chartH - (val / 50) * chartH;
  const getX = (index: number) => padLeft + (index / (monthlyData.length - 1)) * chartW;

  // Build smooth bezier curves
  const buildSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const upperPoints = monthlyData.map((d, i) => ({
    x: getX(i),
    y: getY(toSvgScale(d.budgetAmount)),
  }));

  const lowerPoints = monthlyData.map((d, i) => ({
    x: getX(i),
    y: getY(toSvgScale(d.spendAmount)),
  }));

  const upperLinePath = buildSmoothPath(upperPoints);
  const lowerLinePath = buildSmoothPath(lowerPoints);

  const bottomY = padTop + chartH;
  const upperAreaPath = `${upperLinePath} L ${upperPoints[upperPoints.length - 1].x} ${bottomY} L ${upperPoints[0].x} ${bottomY} Z`;
  const lowerAreaPath = `${lowerLinePath} L ${lowerPoints[lowerPoints.length - 1].x} ${bottomY} L ${lowerPoints[0].x} ${bottomY} Z`;

  const yTicks = [50, 40, 30, 20, 10, 0];

  return (
    <div className="w-full relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: '240px' }}
      >
        <defs>
          {/* Upper layer gradient (Golden amber tone) */}
          <linearGradient id="spendAmberGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9A566" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#E6BE8A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F5E4CA" stopOpacity="0.05" />
          </linearGradient>

          {/* Lower layer gradient (Caramel / Terracotta tone) */}
          <linearGradient id="spendCaramelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DE873E" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#DF9352" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E2A66E" stopOpacity="0.35" />
          </linearGradient>

          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#996025" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Horizontal grid lines & Y-axis labels */}
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#EAE0D2"
                strokeWidth={tick === 0 ? '1.2' : '0.75'}
                strokeDasharray={tick === 0 ? 'none' : '3,3'}
              />
              <text
                x={padLeft - 10}
                y={y + 3.5}
                textAnchor="end"
                className="text-[10px] fill-[#8C7D6F] font-medium tabular-nums"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Upper Wave: Budget Allowance */}
        <path d={upperAreaPath} fill="url(#spendAmberGrad)" />
        <path
          d={upperLinePath}
          fill="none"
          stroke="#C89350"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />

        {/* Lower Wave: Actual Spend (Starts at 0 if no transactions, rises on purchase) */}
        <path d={lowerAreaPath} fill="url(#spendCaramelGrad)" />
        <path
          d={lowerLinePath}
          fill="none"
          stroke="#D4772F"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />

        {/* X-axis Month Labels */}
        {monthlyData.map((item, i) => {
          const x = getX(i);
          const isHovered = hoveredIdx === i;
          return (
            <g
              key={item.month}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <rect
                x={x - 16}
                y={padTop}
                width={32}
                height={chartH + padBottom}
                fill="transparent"
              />

              <text
                x={x}
                y={height - 6}
                textAnchor="middle"
                className={`text-[11px] transition-colors ${
                  isHovered ? 'fill-[#2A241F] font-bold' : 'fill-[#8C7D6F] font-medium'
                }`}
              >
                {item.month}
              </text>

              {isHovered && (
                <>
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={bottomY}
                    stroke="#C89350"
                    strokeWidth="1.2"
                    strokeDasharray="3,3"
                    opacity="0.8"
                  />
                  <circle
                    cx={x}
                    cy={getY(toSvgScale(item.budgetAmount))}
                    r="4.5"
                    fill="#C89350"
                    stroke="#FFFDF9"
                    strokeWidth="2"
                  />
                  <circle
                    cx={x}
                    cy={getY(toSvgScale(item.spendAmount))}
                    r="4.5"
                    fill="#D4772F"
                    stroke="#FFFDF9"
                    strokeWidth="2"
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating interactive tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute z-20 pointer-events-none bg-[#241D17] text-[#FAF7F2] px-3.5 py-2 rounded-[10px] shadow-xl text-xs transform -translate-x-1/2 -translate-y-full transition-all border border-white/10"
          style={{
            left: `${(getX(hoveredIdx) / width) * 100}%`,
            top: `${Math.min(getY(toSvgScale(monthlyData[hoveredIdx].budgetAmount)), getY(toSvgScale(monthlyData[hoveredIdx].spendAmount))) - 10}px`,
          }}
        >
          <div className="font-bold text-[11px] text-[#E0AF6A] pb-1 border-b border-white/10 flex items-center justify-between gap-3">
            <span>{monthlyData[hoveredIdx].month} 2026 Pacing</span>
            <span
              className={`text-[10px] font-semibold ${
                monthlyData[hoveredIdx].spendAmount <= monthlyData[hoveredIdx].budgetAmount
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {monthlyData[hoveredIdx].spendAmount === 0
                ? 'Zero Spend'
                : monthlyData[hoveredIdx].spendAmount <= monthlyData[hoveredIdx].budgetAmount
                ? 'Within Budget'
                : 'Over Budget'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-1.5 text-[10px]">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="w-2 h-2 rounded-full bg-[#C89350]" />
              Budget:
            </span>
            <span className="font-semibold text-white tabular-nums">
              {formatCurrency(monthlyData[hoveredIdx].budgetAmount, user.currency)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-[10px] mt-0.5">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="w-2 h-2 rounded-full bg-[#D4772F]" />
              Actual Spend:
            </span>
            <span className="font-semibold text-white tabular-nums">
              {formatCurrency(monthlyData[hoveredIdx].spendAmount, user.currency)}
            </span>
          </div>

          <div className="mt-1 pt-1 border-t border-white/10 flex justify-between text-[9px] text-[#C6B6A5]">
            <span>Net Remaining:</span>
            <span
              className={`font-bold tabular-nums ${
                monthlyData[hoveredIdx].budgetAmount >= monthlyData[hoveredIdx].spendAmount
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {formatCurrency(
                monthlyData[hoveredIdx].budgetAmount - monthlyData[hoveredIdx].spendAmount,
                user.currency
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
