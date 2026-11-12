import { Sparkles, User, Loader2 } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/store/appStore';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-2.5 text-xs ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs overflow-hidden ${
        isAssistant 
          ? 'bg-[#192923] border border-white/10' 
          : 'bg-[#F08A63] text-white font-bold text-[10px]'
      }`}>
        {isAssistant ? (
          <img src="/app-logo.svg" alt="Morrow" className="w-4.5 h-4.5 object-contain" />
        ) : (
          <User size={13} />
        )}
      </div>

      <div className={`max-w-[85%] rounded-[12px] px-3.5 py-2.5 leading-relaxed ${
        isAssistant 
          ? 'bg-white border border-[#E9E6DE] text-[#242C27] rounded-tl-xs shadow-xs' 
          : 'bg-[#192923] text-white rounded-tr-xs'
      }`}>
        {message.isLoading ? (
          <div className="flex items-center gap-2 py-1 text-xs text-[#858A83]">
            <Loader2 size={13} className="animate-spin text-[#192923]" />
            <span>Consulting budget & preferences...</span>
          </div>
        ) : (
          <div className="space-y-1.5 whitespace-pre-wrap text-xs">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}
