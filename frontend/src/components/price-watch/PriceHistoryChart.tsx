import { useState } from 'react';
import type { PriceObservation } from '@/types/priceWatch';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

export function PriceHistoryChart({
  history,
  targetPrice,
  currency = 'INR',
}: {
  history: PriceObservation[];
  targetPrice?: number;
  currency?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-[#858A83]">
        No price history recorded yet
      </div>
    );
  }

  const prices = history.map((h) => h.price);
  if (targetPrice) prices.push(targetPrice);

  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;
  const priceRange = maxPrice - minPrice || 1;

  const width = 600;
  const height = 200;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 35;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingTop - paddingBottom;

  const points = history.map((h, i) => {
    const x = paddingX + (i / Math.max(1, history.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - ((h.price - minPrice) / priceRange) * graphHeight;
    return { x, y, ...h };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z`;

  const targetY = targetPrice
    ? paddingTop + graphHeight - ((targetPrice - minPrice) / priceRange) * graphHeight
    : null;

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-52 overflow-visible select-none"
      >
        <defs>
          <linearGradient id="price-history-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F08A63" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#F08A63" stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((ratio) => {
          const y = paddingTop + graphHeight * (1 - ratio);
          const priceVal = Math.round(minPrice + priceRange * ratio);
          return (
            <g key={ratio}>
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
                x={paddingX - 8}
                y={y + 3.5}
                textAnchor="end"
                className="text-[10px] fill-[#858A83] font-mono"
              >
                ₹{priceVal.toLocaleString('en-IN')}
              </text>
            </g>
          );
        })}

        {/* Target Price Line */}
        {targetY !== null && (
          <g>
            <line
              x1={paddingX}
              y1={targetY}
              x2={width - paddingX}
              y2={targetY}
              stroke="#F08A63"
              strokeDasharray="5 3"
              strokeWidth={1.5}
            />
            <text
              x={width - paddingX + 6}
              y={targetY + 3.5}
              className="text-[10px] fill-[#F08A63] font-bold"
            >
              Target (₹{targetPrice?.toLocaleString('en-IN')})
            </text>
          </g>
        )}

        {/* Gradient fill area */}
        <path d={areaD} fill="url(#price-history-gradient)" />

        {/* Main Price Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#192923"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Data points */}
        {points.map((pt, i) => (
          <g key={pt.id || i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 6 : 4}
              fill="#192923"
              stroke="#F6F4EE"
              strokeWidth={2}
            />
            {/* Tooltip on hover */}
            {hoveredIndex === i && (
              <g>
                <rect
                  x={Math.max(paddingX, Math.min(pt.x - 55, width - paddingX - 110))}
                  y={pt.y - 42}
                  width={110}
                  height={32}
                  rx={6}
                  fill="#192923"
                  className="drop-shadow-md"
                />
                <text
                  x={Math.max(paddingX + 55, Math.min(pt.x, width - paddingX - 55))}
                  y={pt.y - 28}
                  textAnchor="middle"
                  className="text-[10px] fill-white font-bold tabular-nums"
                >
                  ₹{pt.price.toLocaleString('en-IN')}
                </text>
                <text
                  x={Math.max(paddingX + 55, Math.min(pt.x, width - paddingX - 55))}
                  y={pt.y - 16}
                  textAnchor="middle"
                  className="text-[8px] fill-white/60"
                >
                  {formatDate(pt.observedAt)}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* X-axis date labels */}
        {points.map((pt, i) => (
          <text
            key={'date_' + i}
            x={pt.x}
            y={height - 8}
            textAnchor="middle"
            className="text-[9px] fill-[#858A83]"
          >
            {formatDate(pt.observedAt).slice(0, 6)}
          </text>
        ))}
      </svg>
    </div>
  );
}
