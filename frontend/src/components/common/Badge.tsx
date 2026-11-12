import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'persimmon' | 'forest' | 'lime' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default:   'bg-[#E9E6DE]/70 text-[#242C27]',
    success:   'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    warning:   'bg-amber-50 text-amber-800 border border-amber-200/60',
    error:     'bg-rose-50 text-rose-800 border border-rose-200/60',
    info:      'bg-sky-50 text-sky-800 border border-sky-200/60',
    persimmon: 'bg-[#F08A63]/15 text-[#E27952] border border-[#F08A63]/30 font-semibold',
    forest:    'bg-[#192923] text-white font-semibold',
    lime:      'bg-[#F08A63]/15 text-[#E27952] border border-[#F08A63]/30 font-semibold', // mapped to persimmon
    muted:     'bg-[#E9E6DE] text-[#858A83]',
  };
  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
