export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function pluralize(count: number, word: string, plural?: string): string {
  return count === 1 ? `${count} ${word}` : `${count} ${plural || word + 's'}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}.`;
  if (hour < 17) return `Good afternoon, ${name}.`;
  return `Good evening, ${name}.`;
}

export function getAffordabilityColor(decision: string): string {
  switch (decision) {
    case 'COMFORTABLE': return 'text-green-600 bg-green-50';
    case 'WITHIN_BUDGET': return 'text-green-700 bg-green-50';
    case 'BUDGET_STRAIN': return 'text-amber-600 bg-amber-50';
    case 'NOT_RECOMMENDED': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}
