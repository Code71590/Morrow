export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showGradient?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 90,
  height = 28,
  color,
  strokeWidth = 1.75,
  showGradient = true,
  className = '',
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="flex items-center justify-center text-[10px] text-[#8B8A84]">—</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  // Default color: if price decreased, emerald green #15803D; if increased, rose; if flat, Forest #19231F
  const isDrop = data[data.length - 1] < data[0];
  const isUp = data[data.length - 1] > data[0];
  const strokeColor = color || (isDrop ? '#15803D' : isUp ? '#E11D48' : '#192923');
  const gradientId = `spark-grad-${Math.random().toString(36).substr(2, 6)}`;

  const lastPoint = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>

      {showGradient && (
        <path d={areaD} fill={`url(#${gradientId})`} />
      )}

      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Target/Current End Dot */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r={2.5}
        fill={strokeColor}
      />
    </svg>
  );
}

