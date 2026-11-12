import { Sparkles, User, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ChatMessage as ChatMessageType } from '@/store/appStore';
import { formatCurrency } from '@/utils/currency';
import { useAppStore } from '@/store/appStore';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isAssistant = message.role === 'assistant';
  const navigate = useNavigate();
  const { setChatOpen, setCartProduct } = useAppStore();

  const handleProductClick = (productId: string) => {
    setChatOpen(false);
    navigate(`/product/${encodeURIComponent(productId)}`);
  };

  return (
    <div className={`flex gap-2.5 text-xs ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs overflow-hidden ${
          isAssistant
            ? 'bg-[#192923] border border-white/10'
            : 'bg-[#F08A63] text-white font-bold text-[10px]'
        }`}
      >
        {isAssistant ? (
          <img src="/app-logo.svg" alt="Morrow" className="w-4.5 h-4.5 object-contain" />
        ) : (
          <User size={13} />
        )}
      </div>

      <div
        className={`max-w-[88%] rounded-[12px] px-3.5 py-2.5 leading-relaxed space-y-2.5 ${
          isAssistant
            ? 'bg-white border border-[#E9E6DE] text-[#242C27] rounded-tl-xs shadow-xs'
            : 'bg-[#192923] text-white rounded-tr-xs'
        }`}
      >
        {message.isLoading ? (
          <div className="flex items-center gap-2 py-1 text-xs text-[#858A83]">
            <Loader2 size={13} className="animate-spin text-[#192923]" />
            <span>Consulting budget & live merchant catalog...</span>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap text-xs leading-relaxed">
              {message.content}
            </div>

            {/* Render Verified Channel3 Products if attached to response */}
            {isAssistant && message.relatedProducts && message.relatedProducts.length > 0 && (
              <div className="pt-2 border-t border-[#E9E6DE]/70 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block">
                  Discovered Merchant Products:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {message.relatedProducts.slice(0, 3).map((prod: any, idx: number) => {
                    const price = prod.price || 0;
                    const cur = prod.currency || 'USD';
                    const title = prod.title || 'Product';
                    const img = prod.imageUrl || prod.image || '';
                    const merchant = prod.merchant || prod.brand || 'Retailer';

                    return (
                      <div
                        key={prod.id || idx}
                        onClick={() => handleProductClick(prod.id)}
                        className="p-2 bg-[#F6F4EE] hover:bg-[#EAE6DC] rounded-[8px] border border-[#E9E6DE] flex items-center justify-between gap-2.5 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {img && (
                            <img
                              src={img}
                              alt={title}
                              className="w-9 h-9 object-cover rounded-[5px] bg-white border border-[#E9E6DE] flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h5 className="font-semibold text-xs text-[#192923] truncate group-hover:underline">
                              {title}
                            </h5>
                            <span className="text-[10px] text-[#858A83]">
                              {merchant}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="font-extrabold text-xs text-[#192923] block tabular-nums">
                            {formatCurrency(price, cur)}
                          </span>
                          <span className="text-[10px] text-[#F08A63] font-semibold flex items-center gap-0.5 justify-end">
                            View <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
