import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageContainer({ children, title, subtitle, actions, className, fullWidth }: PageContainerProps) {
  return (
    <div className={cn('flex-1 min-h-[calc(100vh-4rem)] pb-24 lg:pb-12 bg-[#F6F4EE]', className)}>
      <div className={cn('mx-auto px-6 md:px-9 lg:px-10', !fullWidth && 'max-w-[1320px]')}>
        {(title || actions) && (
          <div className="pt-7 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {title && (
                  <h1 className="text-2xl lg:text-[32px] font-extrabold font-heading text-[#192923] tracking-tight leading-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-[#858A83] max-w-2xl leading-relaxed">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2.5 flex-shrink-0">{actions}</div>}
            </div>
          </div>
        )}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
