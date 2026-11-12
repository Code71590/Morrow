import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Brain, Plus, MessageSquare, History, Trash2, ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { ChatMessage } from './ChatMessage';
import { matchScript } from '@/services/mock/aiResponses.mock';
import { assistantService } from '@/services/api/assistantService';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/utils/date';

const QUICK_PROMPTS = [
  "Find me headphones under $200 for travel",
  "Can I afford the $1,200 Samsung laptop?",
  "How much have I spent on shopping this month?",
  "What are my remembered shopping preferences?",
  "Show me top rated wireless earbuds",
];

export function ChatPanel() {
  const {
    chatOpen,
    setChatOpen,
    chatMessages,
    addChatMessage,
    updateLastMessage,
    setChatMessages,
    currentConversationId,
    setCurrentConversationId,
    startNewChat,
    demoSettings,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationList, setConversationList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message if conversation is fresh
  useEffect(() => {
    if (chatOpen && chatMessages.length === 0) {
      addChatMessage({
        id: 'welcome',
        role: 'assistant',
        content: "Hello Alex! I'm Morrow, your AI shopping companion powered by Gemini & Channel3. I can search live merchant products, check your discretionary budget, remember your preferences in Mem0, and verify PayPal checkout. What are you looking to buy?",
        timestamp: new Date().toISOString(),
      });
    }
  }, [chatOpen, chatMessages.length, addChatMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Load conversation list when history drawer is opened
  const loadConversations = async () => {
    setLoadingHistory(true);
    try {
      const convs = await assistantService.getConversations();
      if (Array.isArray(convs)) {
        setConversationList(convs);
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory) {
      loadConversations();
    }
    setShowHistory((prev) => !prev);
  };

  const handleStartNewConversation = () => {
    startNewChat();
    setShowHistory(false);
    addChatMessage({
      id: 'welcome_' + Date.now(),
      role: 'assistant',
      content: "Started a fresh conversation! I'm Morrow. What would you like to search, calculate, or track?",
      timestamp: new Date().toISOString(),
    });
  };

  const handleSelectConversation = async (convId: string) => {
    setShowHistory(false);
    setIsTyping(true);
    try {
      const conv = await assistantService.getConversation(convId);
      if (conv && Array.isArray(conv.messages)) {
        setCurrentConversationId(conv.id);
        const mapped = conv.messages.map((m: any) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: m.createdAt,
        }));
        setChatMessages(mapped);
      }
    } catch (err) {
      console.warn('Failed to switch conversation:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    try {
      await assistantService.deleteConversation(convId);
      setConversationList((prev) => prev.filter((c) => c.id !== convId));
      if (currentConversationId === convId) {
        handleStartNewConversation();
      }
    } catch (err) {
      console.warn('Failed to delete conversation:', err);
    }
  };

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
      // Always attempt live Gemini & Channel3 assistant chat
      const result = await assistantService.chat(text, currentConversationId || undefined);
      if (result?.conversationId) {
        setCurrentConversationId(result.conversationId);
      }
      updateLastMessage({
        content: result.response,
        isLoading: false,
        relatedProducts: result.relatedProducts,
      });
      setIsTyping(false);
      return;
    } catch (err: any) {
      console.warn('Live Gemini assistant error, using local fallback:', err);
      const script = matchScript(text);
      updateLastMessage({
        content: script.text,
        isLoading: false,
        action: script.action,
      });
      setIsTyping(false);
      return;
    }
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[440px] bg-[#F6F4EE] border-l border-[#E9E6DE] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-3.5 border-b border-[#303933] flex items-center justify-between bg-[#192923] text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#303933] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src="/app-logo.svg" alt="Morrow Mascot" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading">Morrow Companion</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F08A63]" />
              <span>Gemini 3.8 Flash & Channel3</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* New Chat Button */}
          <button
            onClick={handleStartNewConversation}
            className="px-2.5 py-1 rounded-[8px] bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Start a new conversation"
          >
            <Plus size={13} />
            <span>New Chat</span>
          </button>

          {/* Conversations History Drawer Toggle */}
          <button
            onClick={handleToggleHistory}
            className={`p-1.5 rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
              showHistory ? 'bg-white/20 text-white' : ''
            }`}
            title="Conversation History"
          >
            <History size={16} />
          </button>

          {/* Close Panel Button */}
          <button
            onClick={() => setChatOpen(false)}
            className="p-1.5 rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Slide-down Conversations History Panel */}
      {showHistory && (
        <div className="border-b border-[#E9E6DE] bg-white p-3.5 shadow-md max-h-64 overflow-y-auto space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-1 border-b border-[#E9E6DE]/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83]">
              Your Conversations
            </span>
            <button
              onClick={handleStartNewConversation}
              className="text-xs font-bold text-[#192923] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> New Chat
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-4 text-center text-xs text-[#858A83]">Loading conversations...</div>
          ) : conversationList.length === 0 ? (
            <div className="py-4 text-center text-xs text-[#858A83]">No past conversations found</div>
          ) : (
            <div className="space-y-1">
              {conversationList.map((conv) => {
                const isCurrent = conv.id === currentConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-2 rounded-[8px] flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-[#192923] text-white font-semibold'
                        : 'bg-[#F6F4EE] hover:bg-[#E9E6DE] text-[#192923]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="truncate font-medium">{conv.title || 'Conversation'}</p>
                      <span className={`text-[10px] block ${isCurrent ? 'text-white/60' : 'text-[#858A83]'}`}>
                        {formatDate(conv.updatedAt || conv.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCurrent && <Check size={13} className="text-emerald-400 mr-1" />}
                      <button
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                        className={`p-1 rounded hover:bg-black/10 cursor-pointer ${
                          isCurrent ? 'text-white/70 hover:text-white' : 'text-[#858A83] hover:text-rose-600'
                        }`}
                        title="Delete conversation"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions (shown when fresh chat) */}
      {chatMessages.length <= 2 && (
        <div className="px-4 py-2 border-t border-[#E9E6DE] bg-white/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
            Suggested prompts:
          </span>
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
            className="h-10 px-3.5 font-bold cursor-pointer"
          >
            <Send size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}
