import { useState } from 'react';
import { LogIn, User, Sparkles, Check, Wallet, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { CurrencyCode } from '@/types/user';
import { CURRENCY_LABELS } from '@/types/user';
import { formatCurrency } from '@/utils/currency';
import { MorrowLogo } from '@/components/common/MorrowLogo';

export function LoginModal() {
  const { isLoggedIn, isLoginModalOpen, setIsLoginModalOpen, login, user, financialProfile } = useAppStore();

  const [name, setName] = useState(user.displayName || 'Alex');
  const [currency, setCurrency] = useState<CurrencyCode>(user.currency || 'INR');
  const [income, setIncome] = useState(String(financialProfile.monthlyIncome || 65000));
  const [essentials, setEssentials] = useState(String(financialProfile.essentialExpenses || 32450));
  const [savings, setSavings] = useState(String(financialProfile.savingsCommitment || 10000));
  const [startAtZero, setStartAtZero] = useState(false);

  if (!isLoginModalOpen) return null;

  const numIncome = parseFloat(income) || 0;
  const numEssentials = parseFloat(essentials) || 0;
  const numSavings = parseFloat(savings) || 0;
  const calculatedDiscretionary = Math.max(0, numIncome - numEssentials - numSavings);

  const handleSelectPreset = (presetName: string, curr: CurrencyCode, inc: number, ess: number, sav: number) => {
    setName(presetName);
    setCurrency(curr);
    setIncome(String(inc));
    setEssentials(String(ess));
    setSavings(String(sav));
  };

  const handleQuickDefault = () => {
    login('Alex', 65000, 'INR', 32450, 10000, false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name.trim() || 'Alex', numIncome, currency, numEssentials, numSavings, startAtZero);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FAF7F2] rounded-[24px] border border-[#EADDCF] shadow-[0_25px_60px_-15px_rgba(95,65,35,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#F2ECE2] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#C89B67] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <MorrowLogo className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-[#2A241F] tracking-tight flex items-center gap-2">
                <span>Welcome to Morrow</span>
                <span className="text-[10px] font-semibold bg-[#2A241F] text-[#FAF7F2] px-2 py-0.5 rounded-full">
                  Sign In
                </span>
              </h2>
              <p className="text-xs text-[#8C7D6F]">
                Configure your identity and baseline budget parameters to begin
              </p>
            </div>
          </div>

          {/* Close button if user already has an active session */}
          {isLoggedIn && (
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#EAE0D2] text-[#8C7D6F] transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick Demo Profile Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C7D6F]">
                Select Demo Profile or Customize
              </label>
              <span className="text-[10px] text-[#A27B4E] font-medium">1-Click Presets</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('Alex', 'INR', 65000, 32450, 10000)}
                className={`px-3 py-2 rounded-[12px] border text-left transition-all cursor-pointer ${
                  currency === 'INR' && name === 'Alex'
                    ? 'bg-[#2A241F] text-white border-[#2A241F] shadow-xs'
                    : 'bg-white border-[#E6DFD5] text-[#2A241F] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-xs font-bold truncate">🇮🇳 Alex</div>
                <div className="text-[10px] opacity-80 mt-0.5 truncate">₹65k · INR</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('Sarah', 'USD', 6500, 3100, 1500)}
                className={`px-3 py-2 rounded-[12px] border text-left transition-all cursor-pointer ${
                  currency === 'USD' && name === 'Sarah'
                    ? 'bg-[#2A241F] text-white border-[#2A241F] shadow-xs'
                    : 'bg-white border-[#E6DFD5] text-[#2A241F] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-xs font-bold truncate">🇺🇸 Sarah</div>
                <div className="text-[10px] opacity-80 mt-0.5 truncate">$6.5k · USD</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('Oliver', 'GBP', 4200, 2100, 800)}
                className={`px-3 py-2 rounded-[12px] border text-left transition-all cursor-pointer ${
                  currency === 'GBP' && name === 'Oliver'
                    ? 'bg-[#2A241F] text-white border-[#2A241F] shadow-xs'
                    : 'bg-white border-[#E6DFD5] text-[#2A241F] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-xs font-bold truncate">🇬🇧 Oliver</div>
                <div className="text-[10px] opacity-80 mt-0.5 truncate">£4.2k · GBP</div>
              </button>
            </div>

            {/* Start at 0 toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2A241F] bg-white p-2.5 rounded-[10px] border border-[#E6DFD5] hover:bg-[#F8F5EE] transition-colors">
                <input
                  type="checkbox"
                  checked={startAtZero}
                  onChange={(e) => setStartAtZero(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E6DFD5] text-[#C89B67] focus:ring-[#C89B67] cursor-pointer"
                />
                <span className="text-[11px] font-medium text-[#2A241F]">
                  Start account with <strong>0 transactions</strong> (chart starts at 0, updates live on purchase)
                </span>
              </label>
            </div>
          </div>

          {/* Name & Currency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                Your Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7D6F]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  required
                  className="w-full h-10 pl-9 pr-3 bg-white border border-[#E6DFD5] rounded-[10px] text-xs text-[#2A241F] focus:outline-none focus:border-[#2A241F] transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full h-10 px-3 bg-white border border-[#E6DFD5] rounded-[10px] text-xs text-[#2A241F] focus:outline-none focus:border-[#2A241F] transition-all font-medium"
              >
                {Object.entries(CURRENCY_LABELS).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Inputs: Income, Essentials, Savings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                Monthly Income
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                min="0"
                step="any"
                required
                className="w-full h-10 px-3 bg-white border border-[#E6DFD5] rounded-[10px] text-xs font-semibold text-[#2A241F] focus:outline-none focus:border-[#2A241F] transition-all tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                Fixed Expenses
              </label>
              <input
                type="number"
                value={essentials}
                onChange={(e) => setEssentials(e.target.value)}
                min="0"
                step="any"
                required
                className="w-full h-10 px-3 bg-white border border-[#E6DFD5] rounded-[10px] text-xs font-semibold text-[#2A241F] focus:outline-none focus:border-[#2A241F] transition-all tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                Savings Goal
              </label>
              <input
                type="number"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                min="0"
                step="any"
                required
                className="w-full h-10 px-3 bg-white border border-[#E6DFD5] rounded-[10px] text-xs font-semibold text-[#2A241F] focus:outline-none focus:border-[#2A241F] transition-all tabular-nums"
              />
            </div>
          </div>

          {/* Real-time Calculated Discretionary Runway */}
          <div className="p-3.5 rounded-[14px] bg-[#EFE8DE] border border-[#E2D5C4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-[#B8854D]" />
              <div>
                <div className="text-[11px] font-bold text-[#2A241F]">
                  Calculated Discretionary Budget
                </div>
                <div className="text-[10px] text-[#8C7D6F]">
                  Income minus essentials and savings commitment
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-extrabold text-[#2A241F] tabular-nums">
                {formatCurrency(calculatedDiscretionary, currency)}
              </div>
              <span className="text-[9px] font-semibold text-emerald-700">Safe to spend</span>
            </div>
          </div>

          {/* Actions: Primary Submit + Fast 1-Click Default */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full h-11 rounded-[12px] bg-[#2A241F] hover:bg-[#3D342C] text-[#FAF7F2] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <LogIn size={14} className="text-[#D9A566]" />
              <span>Enter Dashboard ({name} · {currency})</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDefault}
              className="w-full py-1.5 text-center text-[11px] font-medium text-[#8C7D6F] hover:text-[#2A241F] transition-colors cursor-pointer"
            >
              Or quick start with default Alex (₹65,000 INR) →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
