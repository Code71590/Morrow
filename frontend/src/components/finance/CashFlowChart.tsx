import { useState } from 'react';
import { DEMO_MONTHLY_SUMMARIES } from '@/data/demoData';
import { formatCurrency } from '@/utils/currency';

export function CashFlowChart({
  height = 240,
}: {
  height?: number;
}) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const data = [...DEMO_MONTHLY_SUMMARIES].reverse(); // Sep, Oct, Nov
  const allValues = data.flatMap(d => [d.totalIncome, d.totalExpenses]);
  const maxVal = Math.max(...allValues) * 1.15;
  const minVal = 0;
  const range = maxVal - minVal;

  const width = 800;
  const paddingX = 65;
  const paddingTop = 25;
  const paddingBottom = 40;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingTop - paddingBottom;

  const getPoints = (key: 'totalIncome' | 'totalExpenses') => {
    return data.map((d, i) => {
      const x = paddingX + (i / Math.max(1, data.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - ((d[key] - minVal) / range) * graphHeight;
      return { x, y, val: d[key], month: d.monthName };
    });
  };

  const incomePoints = getPoints('totalIncome');
  const expensePoints = getPoints('totalExpenses');

  // Generate smooth SVG curve
  const makePath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');
  };

  const incomePath = makePath(incomePoints);
  const expensePath = makePath(expensePoints);

  const incomeArea = `${incomePath} L ${incomePoints[incomePoints.length - 1].x} ${paddingTop + graphHeight} L ${incomePoints[0].x} ${paddingTop + graphHeight} Z`;

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-60 overflow-visible select-none"
      >
        <defs>
          <linearGradient id="cashflow-inflow-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#192923" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#192923" stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((r) => {
          const y = paddingTop + graphHeight * (1 - r);
          const val = Math.round(minVal + range * r);
          return (
            <g key={r}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E9E6DE"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <text
                x={paddingX - 10}
                y={y + 3.5}
                textAnchor="end"
                className="text-[10px] fill-[#858A83] font-mono"
              >
                ₹{val >= 1000 ? `${Math.round(val / 1000)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Shaded Area under Inflow */}
        <path d={incomeArea} fill="url(#cashflow-inflow-grad)" />

        {/* Inflow Line (Deep Forest) */}
        <path
          d={incomePath}
          fill="none"
          stroke="#192923"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Outflow Line (Soft Persimmon) */}
        <path
          d={expensePath}
          fill="none"
          stroke="#F08A63"
          strokeWidth={2.5}
          strokeDasharray="5 4"
          strokeLinecap="round"
        />

        {/* Data points & X-axis labels */}
        {data.map((d, i) => {
          const incPt = incomePoints[i];
          const expPt = expensePoints[i];

          return (
            <g key={d.month || i} className="cursor-pointer" onMouseEnter={() => setHoveredMonth(i)} onMouseLeave={() => setHoveredMonth(null)}>
              {/* Vertical Guide Line */}
              <line
                x1={incPt.x}
                y1={paddingTop}
                x2={incPt.x}
                y2={paddingTop + graphHeight}
                stroke={hoveredMonth === i ? '#192923' : 'transparent'}
                strokeWidth={1}
                strokeDasharray="2 2"
              />

              {/* Inflow Marker */}
              <circle
                cx={incPt.x}
                cy={incPt.y}
                r={hoveredMonth === i ? 6 : 4}
                fill="#192923"
                stroke="#F6F4EE"
                strokeWidth={2}
              />

              {/* Outflow Marker */}
              <circle
                cx={expPt.x}
                cy={expPt.y}
                r={hoveredMonth === i ? 6 : 4}
                fill="#F08A63"
                stroke="#F6F4EE"
                strokeWidth={2}
              />

              {/* X-axis Month Label */}
              <text
                x={incPt.x}
                y={height - 10}
                textAnchor="middle"
                className={`text-xs font-semibold ${hoveredMonth === i ? 'fill-[#192923] font-bold' : 'fill-[#858A83]'}`}
              >
                {d.monthName}
              </text>

              {/* Hover Tooltip */}
              {hoveredMonth === i && (
                <g>
                  <rect
                    x={Math.max(paddingX, Math.min(incPt.x - 70, width - paddingX - 140))}
                    y={Math.min(incPt.y, expPt.y) - 52}
                    width={140}
                    height={46}
                    rx={8}
                    fill="#192923"
                    className="drop-shadow-lg"
                  />
                  <text
                    x={Math.max(paddingX + 70, Math.min(incPt.x, width - paddingX - 70))}
                    y={Math.min(incPt.y, expPt.y) - 34}
                    textAnchor="middle"
                    className="text-[10px] fill-white font-bold"
                  >
                    In: ₹{incPt.val.toLocaleString('en-IN')}
                  </text>
                  <text
                    x={Math.max(paddingX + 70, Math.min(incPt.x, width - paddingX - 70))}
                    y={Math.min(incPt.y, expPt.y) - 18}
                    textAnchor="middle"
                    className="text-[10px] fill-[#F08A63] font-bold"
                  >
                    Out: ₹{expPt.val.toLocaleString('en-IN')}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend below chart */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-[#192923] rounded-full" />
          <span className="text-[#242C27] font-semibold">Total Income Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-[#F08A63] rounded-full" />
          <span className="text-[#858A83] font-medium">Monthly Outflow (Fixed & Discretionary)</span>
        </div>
      </div>
    </div>
  );
}
