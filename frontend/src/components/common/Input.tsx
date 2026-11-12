import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#242C27]/75 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858A83] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-12 px-4 bg-white border border-[#E9E6DE] rounded-[10px] text-sm text-[#242C27]',
              'placeholder:text-[#858A83] focus:outline-none focus:border-[#192923] focus:ring-2 focus:ring-[#192923]/10',
              'transition-all duration-150',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-100',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#858A83] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-[#858A83]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
