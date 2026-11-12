import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, className, onClick, hoverable, padding = 'md' }: CardProps) {
  const pads = { none: '', sm: 'p-4', md: 'p-5 lg:p-6', lg: 'p-6 lg:p-8' };
  return (
    <div
      className={cn(
        'bg-white border border-[#E9E6DE] rounded-[14px] text-[#242C27] shadow-[0_6px_24px_rgba(25,41,35,0.045)]',
        pads[padding],
        hoverable && 'cursor-pointer hover:border-[#192923]/25 hover:shadow-[0_8px_30px_rgba(25,41,35,0.07)] transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
