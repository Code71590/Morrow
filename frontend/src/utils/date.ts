import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function formatDate(dateStr: string, fmt = 'MMM d, yyyy'): string {
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, fmt) : dateStr;
  } catch { return dateStr; }
}

export function formatRelative(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : dateStr;
  } catch { return dateStr; }
}

export function groupByMonth<T extends { transactionDate?: string; createdAt?: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const dateStr = item.transactionDate || item.createdAt || '';
    const key = dateStr.substring(0, 7);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function getMonthName(monthStr: string): string {
  try {
    return format(parseISO(monthStr + '-01'), 'MMMM yyyy');
  } catch { return monthStr; }
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function formatShortDate(dateStr: string): string {
  return formatDate(dateStr, 'MMM d');
}
