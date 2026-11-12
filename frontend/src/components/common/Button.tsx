import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'default', isLoading, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F08A63]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const variants = {
      primary: 'bg-[#F08A63] text-white hover:bg-[#E27952] active:bg-[#D46B44] shadow-xs font-semibold',
      secondary: 'bg-[#192923] text-white hover:bg-[#24352D] active:bg-[#14201B] shadow-xs',
      ghost: 'bg-transparent text-[#858A83] hover:text-[#242C27] hover:bg-[#E9E6DE]/50 active:bg-[#E9E6DE]',
      danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 active:bg-rose-200 border border-rose-200',
      outline: 'bg-white text-[#242C27] border border-[#E9E6DE] hover:bg-[#F6F4EE] hover:border-[#D8D4C8] active:bg-[#E9E6DE]',
    };

    const sizes = {
      default: 'h-[46px] px-5 text-sm',
      sm: 'h-9 px-3.5 text-xs',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
