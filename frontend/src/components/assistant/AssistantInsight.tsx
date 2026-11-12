import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';

export interface AssistantInsightProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'persimmon' | 'lime' | 'compact';
}

export function AssistantInsight({ title, description, actionLabel, onAction, variant = 'default' }: AssistantInsightProps) {
  if (variant === 'compact') {
    return (
      <div className="p-3 bg-white border border-[#E9E6DE] rounded-[10px] flex items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles size={14} className="text-[#192923] flex-shrink-0" />
          <span className="text-[#242C27] truncate font-medium">{description}</span>
        </div>
        {actionLabel && (
          <button onClick={onAction} className="text-[#192923] font-bold flex-shrink-0 hover:text-[#F08A63] transition-colors cursor-pointer">
            {actionLabel} →
          </button>
        )}
      </div>
    );
  }

  const isAccent = variant === 'persimmon' || variant === 'lime';

  return (
    <div className={`p-5 rounded-[14px] border ${
      isAccent 
        ? 'bg-[#F08A63]/10 border-[#F08A63]/30' 
        : 'bg-[#192923] text-white border-[#303933]'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 ${
          isAccent ? 'bg-[#192923] text-[#F08A63]' : 'bg-[#F08A63] text-white'
        }`}>
          <Sparkles size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold font-heading mb-1 ${isAccent ? 'text-[#192923]' : 'text-white'}`}>
            {title}
          </h4>
          <p className={`text-xs leading-relaxed ${isAccent ? 'text-[#242C27]' : 'text-white/70'}`}>
            {description}
          </p>
          {actionLabel && onAction && (
            <div className="mt-3">
              <Button
                variant={isAccent ? 'secondary' : 'primary'}
                size="sm"
                onClick={onAction}
                rightIcon={<ArrowRight size={14} />}
                className="text-xs h-8.5 font-semibold"
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
