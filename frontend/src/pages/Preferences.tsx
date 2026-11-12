import { useState, useEffect } from 'react';
import { 
  Brain, Plus, Trash2, Edit3, Sparkles, Check, 
  RotateCcw, ShieldCheck, Heart, User, Settings
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { useAppStore } from '@/store/appStore';
import { formatRelative } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import type { Memory, MemoryCategory } from '@/types/memory';
import type { CurrencyCode } from '@/types/user';
import { CURRENCY_LABELS } from '@/types/user';
import { memoryService } from '@/services/api/memoryService';

export function Preferences() {
  const { 
    user, memories, demoSettings, 
    addMemory, updateMemory, deleteMemory, clearMemories, 
    setUserCurrency, toggleAiMode, resetDemoData 
  } = useAppStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('shopping_preference');

  useEffect(() => {
    memoryService.getMemories().then((serverMemories) => {
      if (serverMemories && serverMemories.length > 0) {
        serverMemories.forEach((sm) => {
          if (!memories.some((m) => m.id === sm.id)) {
            addMemory(sm);
          }
        });
      }
    }).catch(() => {});
  }, []);

  const handleSaveNewMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    if (editingMemory) {
      updateMemory(editingMemory.id, newContent.trim());
      memoryService.updateMemory(editingMemory.id, newContent.trim()).catch(() => {});
      setEditingMemory(null);
    } else {
      const memory: Memory = {
        id: 'mem_' + Date.now(),
        category: newCategory,
        content: newContent.trim(),
        source: 'explicit',
        confidence: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addMemory(memory);
      memoryService.addMemory(newContent.trim(), newCategory).catch(() => {});
    }

    setNewContent('');
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (m: Memory) => {
    setEditingMemory(m);
    setNewContent(m.content);
    setNewCategory(m.category);
    setIsAddModalOpen(true);
  };

  return (
    <PageContainer
      title="Personalization & Memory"
      subtitle="Inspect, edit, and control what Morrow remembers about your taste, brand loyalties, and spending boundaries."
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingMemory(null);
            setNewContent('');
            setIsAddModalOpen(true);
          }}
          leftIcon={<Plus size={16} />}
          className="text-xs font-semibold"
        >
          Add Memory
        </Button>
      }
    >
      <div className="space-y-6 pt-1 pb-12">
        {/* User Profile & Demo Settings Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Profile Card */}
          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#192923] text-[#F08A63] flex items-center justify-center font-bold text-sm">
                {user.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#192923]">{user.displayName}</h3>
                <span className="text-xs text-[#858A83]">{user.country} · Demo Profile</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E9E6DE] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#858A83]">Monthly Income:</span>
                <strong className="text-[#192923] tabular-nums">{formatCurrency(user.monthlyIncome, user.currency)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858A83]">Active Memories:</span>
                <strong className="text-[#192923]">{memories.length} records</strong>
              </div>
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)] space-y-2.5">
            <div className="flex items-center justify-between text-[#192923] font-bold text-xs uppercase tracking-wider">
              <span>Display Currency</span>
              <span className="text-[#F08A63] font-mono">₹ INR Default</span>
            </div>
            <select
              value={user.currency}
              onChange={(e) => setUserCurrency(e.target.value as CurrencyCode)}
              className="w-full h-10 px-3 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[8px] text-xs font-semibold text-[#192923] focus:outline-none focus:border-[#192923]"
            >
              {Object.entries(CURRENCY_LABELS).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <p className="text-[11px] text-[#858A83]">
              Synchronizes financial ledgers, product catalogs, and affordability assessments.
            </p>
          </div>

          {/* Presentation & AI Mode Card */}
          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)] space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#192923] mb-1">
                <span>AI Response Engine</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  demoSettings.aiMode ? 'bg-[#F08A63] text-white' : 'bg-[#F6F4EE] text-[#858A83]'
                }`}>
                  {demoSettings.aiMode ? 'GEMINI 2.0 FLASH' : 'PRE-SCRIPTED'}
                </span>
              </div>
              <p className="text-[11px] text-[#858A83] leading-relaxed">
                Toggle between deterministic scripts (instant & predictable for presentation recordings) and live Gemini AI calls.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleAiMode}
              leftIcon={<Brain size={14} className={demoSettings.aiMode ? "text-[#F08A63]" : ""} />}
              className="text-xs w-full font-semibold"
            >
              Switch to {demoSettings.aiMode ? 'Pre-scripted Demo Mode' : 'Live Gemini 2.0 Flash'}
            </Button>
          </div>
        </div>

        {/* Memories Management Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold font-heading text-[#192923] flex items-center gap-2">
                <span>Morrow Knowledge & Context Memory</span>
                <Badge variant="default">{memories.length} Memories</Badge>
              </h2>
              <p className="text-xs text-[#858A83]">
                Distinguishing explicitly stated user facts from AI-inferred shopping habits.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Clear all memories? Morrow will start with a fresh slate.')) {
                    clearMemories();
                    memoryService.clearAllMemories().catch(() => {});
                  }
                }}
                leftIcon={<Trash2 size={13} />}
                className="text-xs h-8"
              >
                Clear All Memories
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memories.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-[#E9E6DE] hover:border-[#192923]/30 rounded-[14px] p-4 flex flex-col justify-between shadow-[0_6px_24px_rgba(25,41,35,0.045)] transition-all duration-150"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83]">
                      {m.category.replace('_', ' ')}
                    </span>
                    <Badge variant={m.source === 'explicit' ? 'persimmon' : 'default'} size="sm">
                      {m.source === 'explicit' ? 'Explicit Fact' : `Inferred (${Math.round((m.confidence || 0.8) * 100)}%)`}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#242C27] font-medium leading-relaxed">
                    "{m.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E9E6DE] text-[11px] text-[#858A83]">
                  <span>Updated {formatRelative(m.updatedAt)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(m)}
                      className="p-1 hover:text-[#192923] cursor-pointer"
                      title="Edit memory"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        deleteMemory(m.id);
                        memoryService.deleteMemory(m.id).catch(() => {});
                      }}
                      className="p-1 hover:text-rose-600 cursor-pointer"
                      title="Delete memory"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Memory Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMemory(null);
        }}
        title={editingMemory ? "Edit Memory Record" : "Add Personalization Memory"}
        size="md"
      >
        <form onSubmit={handleSaveNewMemory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#858A83] mb-1.5">
              Memory Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
              className="w-full h-10 px-3 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[8px] text-xs font-semibold text-[#192923] focus:outline-none focus:border-[#192923]"
            >
              <option value="shopping_preference">Shopping Preference</option>
              <option value="brand_preference">Brand Preference</option>
              <option value="financial_preference">Financial Boundary</option>
              <option value="product_interest">Product Wish / Interest</option>
              <option value="personal_goal">Personal Financial Goal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#858A83] mb-1.5">
              Memory Content
            </label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="e.g. Always prefers noise-cancelling over-ear headphones with long battery life..."
              rows={3}
              className="w-full p-3 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[8px] text-xs text-[#242C27] focus:outline-none focus:border-[#192923]"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="font-semibold"
            >
              Save Memory
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
