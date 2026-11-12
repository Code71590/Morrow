import { useState, useEffect } from 'react';
import { User, Wallet, LogOut, Check, X, Shield, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { CurrencyCode } from '@/types/user';
import { CURRENCY_LABELS } from '@/types/user';
import { formatCurrency } from '@/utils/currency';

export function ProfileBudgetModal() {
  const { 
    user, financialProfile, isProfileModalOpen, setIsProfileModalOpen, 
    updateUserAndBudget, logout 
  } = useAppStore();

  const [name, setName] = useState(user.displayName);
  const [currency, setCurrency] = useState<CurrencyCode>(user.currency);
  const [income, setIncome] = useState(String(financialProfile.monthlyIncome));
  const [essentials, setEssentials] = useState(String(financialProfile.essentialExpenses));
  const [savings, setSavings] = useState(String(financialProfile.savingsCommitment));
  const [reserve, setReserve] = useState(String(financialProfile.safetyReserve || 1500));
  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever modal opens or user changes
  useEffect(() => {
    if (isProfileModalOpen) {
      setName(user.displayName);
      setCurrency(user.currency);
      setIncome(String(financialProfile.monthlyIncome));
      setEssentials(String(financialProfile.essentialExpenses));
      setSavings(String(financialProfile.savingsCommitment));
      setReserve(String(financialProfile.safetyReserve || 1500));
      setIsSaved(false);
    }
  }, [isProfileModalOpen, user, financialProfile]);

  if (!isProfileModalOpen) return null;

  const numIncome = parseFloat(income) || 0;
  const numEssentials = parseFloat(essentials) || 0;
  const numSavings = parseFloat(savings) || 0;
  const numReserve = parseFloat(reserve) || 0;
  const liveDiscretionary = Math.max(0, numIncome - numEssentials - numSavings - numReserve);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserAndBudget({
      name: name.trim() || 'Alex',
      currency,
      monthlyIncome: numIncome,
      essentialExpenses: numEssentials,
      savingsCommitment: numSavings,
      safetyReserve: numReserve,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsProfileModalOpen(false);
    }, 450);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none animate-in fade-in duration-150"
      onClick={() => setIsProfileModalOpen(false)}
    >
      <div 
        className="w-full max-w-lg bg-[#FAF7F2] rounded-[24px] border border-[#EADDCF] shadow-[0_25px_60px_-15px_rgba(95,65,35,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#F2ECE2] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EADDCF] flex items-center justify-center text-[#2A241F] font-bold text-sm">
              {name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-[#2A241F] tracking-tight">
                Profile & Financial Budget
              </h2>
              <p className="text-xs text-[#8C7D6F]">
                Update your account details and discretionary spending limits
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#EAE0D2] text-[#8C7D6F] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Identity: Name & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                Display Name
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
                Currency
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

          {/* Financial Breakdown Inputs */}
          <div className="pt-2 border-t border-[#E8DFD3]">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7D6F] mb-2">
              Monthly Budget Configuration
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Monthly Income */}
              <div>
                <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                  Monthly Take-Home Income
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

              {/* Fixed Expenses */}
              <div>
                <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                  Fixed Essential Expenses
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

              {/* Protected Savings Goal */}
              <div>
                <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                  Protected Savings Goal (SIP)
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

              {/* Safety Reserve */}
              <div>
                <label className="block text-xs font-semibold text-[#2A241F] mb-1">
                  Safety Reserve / Buffer
                </label>
                <input
                  type="number"
                  value={reserve}
                  onChange={(e) => setReserve(e.target.value)}
                  min="0"
                  step="any"
                  className="w-full h-10 px-3 bg-white border border-[#E6DFD5] rounded-[10px] text-xs font-semibold text-[#2A241F] focus:outline-none focus:border-[#2A241F] transition-all tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Live Calculated Discretionary Runway */}
          <div className="p-3.5 rounded-[14px] bg-[#EFE8DE] border border-[#E2D5C4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wallet size={18} className="text-[#B8854D]" />
              <div>
                <div className="text-xs font-bold text-[#2A241F]">
                  Available Discretionary Runway
                </div>
                <div className="text-[10px] text-[#8C7D6F]">
                  Income minus fixed expenses, savings, and safety buffer
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-extrabold text-[#2A241F] tabular-nums">
                {formatCurrency(liveDiscretionary, currency)}
              </div>
              <span className="text-[10px] font-semibold text-emerald-700">Calculated Runway</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="h-10 px-3.5 rounded-[10px] border border-rose-200 bg-rose-50/70 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Log out of current demo session"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="h-10 px-4 rounded-[10px] bg-white border border-[#E6DFD5] text-[#2A241F] text-xs font-semibold hover:bg-[#F6F3EC] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-10 px-5 rounded-[10px] bg-[#2A241F] hover:bg-[#3D342C] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                {isSaved ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

