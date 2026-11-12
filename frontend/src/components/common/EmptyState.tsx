import { ReactNode } from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center bg-white border border-dashed border-[#E9E6DE] rounded-[14px] shadow-[0_6px_24px_rgba(25,41,35,0.03)]">
      {icon ? (
        <div className="w-12 h-12 rounded-[12px] bg-[#F6F4EE] flex items-center justify-center mb-3 text-[#192923] border border-[#E9E6DE]">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-[12px] bg-[#F6F4EE] flex items-center justify-center mb-3 border border-[#E9E6DE] overflow-hidden">
          <img src="/app-logo.svg" alt="Morrow" className="w-8 h-8 object-contain" />
        </div>
      )}
      <h3 className="text-sm font-bold font-heading text-[#192923] mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-[#858A83] max-w-sm mb-4 leading-relaxed">{description}</p>
      )}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick} className="text-xs font-semibold">
          {action.label}
        </Button>
      )}
    </div>
  );
}
