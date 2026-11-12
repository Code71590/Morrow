import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Brain, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { ChatMessage } from './ChatMessage';
import { matchScript } from '@/services/mock/aiResponses.mock';
import { assistantService } from '@/services/api/assistantService';
import { Button } from '@/components/common/Button';

const QUICK_PROMPTS = [
  "Find me headphones under ₹15,000 for travel",
  "Can I afford the ₹1,19,990 Samsung laptop?",
  "How much have I spent on shopping this month?",
  "What was that laptop I postponed last month?",
  "Set up a price watch for Sony WH-1000XM5",
];

export function ChatPanel() {
  const { chatOpen, setChatOpen, chatMessages, addChatMessage, updateLastMessage, clearChat, demoSettings } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen && chatMessages.length === 0) {
      addChatMessage({
        id: 'welcome',
        role: 'assistant',
        content: "Hello Alex! I'm Morrow, your personal shopping companion. I evaluate whether purchases fit your budget in INR (₹), track price drops across merchants, and remember your preferences. What are you looking to buy?",
        timestamp: new Date().toISOString(),
      });
    }
  }, [chatOpen, chatMessages.length, addChatMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    setInput('');
    const userMsgId = 'u_' + Date.now();
    addChatMessage({
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    });

    const botMsgId = 'b_' + (Date.now() + 1);
    addChatMessage({
      id: botMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isLoading: true,
    });
    setIsTyping(true);

    try {
      if (demoSettings.aiMode) {
        const result = await assistantService.chat(text);
        updateLastMessage({
          content: result.response,
          isLoading: false,
          relatedProducts: result.relatedProducts,
        });
        setIsTyping(false);
        return;
      }
    } catch (err: any) {
      console.warn('Live Gemini assistant error, falling back:', err);
      updateLastMessage({
        content: `⚠️ Note: ${err.message || 'Gemini service unconfigured'}. Switched to local deterministic engine:\n\n`,
        isLoading: false,
      });
    }

    const script = matchScript(text);

    setTimeout(() => {
      updateLastMessage({
        content: script.text,
        isLoading: false,
        action: script.action,
      });
      setIsTyping(false);
    }, script.delay);
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-[#F6F4EE] border-l border-[#E9E6DE] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#303933] flex items-center justify-between bg-[#192923] text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#303933] border border-white/10 flex items-center justify-center overflow-hidden">
            <img src="/app-logo.svg" alt="Morrow Mascot" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading">Morrow Companion</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-white/60">
              <span className={`w-1.5 h-1.5 rounded-full ${demoSettings.aiMode ? 'bg-[#F08A63]' : 'bg-emerald-400'}`} />
              <span>{demoSettings.aiMode ? 'Gemini 2.0 Flash' : 'Deterministic Engine'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-[8px] text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="p-1.5 rounded-[8px] text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {chatMessages.length <= 2 && (
        <div className="px-4 py-2 border-t border-[#E9E6DE] bg-white/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">Suggested prompts:</span>
          <div className="flex flex-col gap-1">
            {QUICK_PROMPTS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-left text-xs text-[#242C27] hover:text-[#192923] py-1 px-2 rounded-[6px] hover:bg-[#E9E6DE]/60 transition-colors truncate cursor-pointer"
              >
                • {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 border-t border-[#E9E6DE] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about budget, products, or price drops..."
            disabled={isTyping}
            className="flex-1 h-10 px-3.5 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[10px] text-xs text-[#242C27] placeholder:text-[#858A83] focus:outline-none focus:border-[#192923] disabled:opacity-50"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!input.trim() || isTyping}
            className="h-10 px-3.5 font-bold"
          >
            <Send size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}
