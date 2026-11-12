import { useState } from 'react';
import { Bell, User, Sparkles, Check, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useNavigate } from 'react-router-dom';

interface FintechHeaderProps {
  useLiveAccountData: boolean;
  onToggleLiveAccount: () => void;
}

export function FintechHeader({ useLiveAccountData, onToggleLiveAccount }: FintechHeaderProps) {
  const { user, setChatOpen, chatOpen, setIsProfileModalOpen, logout } = useAppStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex items-center justify-between pb-6 pt-1">
      {/* Left: FinTech Dashboard | Date */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#2A241F] tracking-tight">
          FinTech Dashboard
        </h1>
        <span className="text-[#C6B6A5] select-none font-light">|</span>
        <span className="text-xs sm:text-sm font-medium text-[#7D7164]">
          {useLiveAccountData ? 'Nov 12, 2026' : 'Oct 26, 2023'}
        </span>
      </div>

      {/* Right: Actions, Bell, Profile */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Live vs Inspiration toggle */}
        <button
          onClick={onToggleLiveAccount}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EFE8DE] text-[#635345] hover:bg-[#E7DDCF] transition-all cursor-pointer border border-[#E2D5C4]"
          title="Toggle between inspiration mock values and your actual account profile"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${useLiveAccountData ? 'bg-emerald-600' : 'bg-[#B8854D]'}`} />
          <span>{useLiveAccountData ? 'Live Profile (INR)' : 'Inspiration Mock (USD)'}</span>
        </button>

        {/* Ask Morrow Assistant Trigger */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#2A241F] text-[#FAF7F2] text-xs font-semibold hover:bg-[#3D342C] transition-colors cursor-pointer shadow-sm"
          title="Open AI Shopping & Budget Copilot"
        >
          <Sparkles size={13} className="text-[#D9A566]" />
          <span className="hidden sm:inline">Ask Morrow</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#554A3F] hover:text-[#2A241F] hover:bg-[#EFE8DE] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4772F]" />
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-11 w-72 bg-[#FCFAF6] border border-[#E9DFD0] rounded-[16px] shadow-xl p-3 z-50 text-xs text-[#2A241F]"
              onMouseLeave={() => setShowNotifications(false)}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EFE8DE] font-semibold text-xs text-[#7D7164]">
                <span>Notifications</span>
                <span className="text-[10px] bg-[#EFE8DE] px-1.5 py-0.5 rounded-full text-[#635345]">2 new</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-[10px] bg-[#FAF5ED] border border-[#F0E6D8]">
                  <div className="font-semibold text-[#2A241F]">Sony XM5 Price Drop</div>
                  <div className="text-[11px] text-[#7D7164] mt-0.5">Dropped to ₹24,990 from ₹29,990</div>
                </div>
                <div className="p-2 rounded-[10px] bg-[#FAF5ED] border border-[#F0E6D8]">
                  <div className="font-semibold text-[#2A241F]">Savings Goal Pace</div>
                  <div className="text-[11px] text-[#7D7164] mt-0.5">You are 65% toward your ₹12,000 monthly reserve.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E9DFD0] hover:bg-[#F2ECE2] transition-colors cursor-pointer text-xs font-semibold text-[#2A241F] shadow-xs"
            title="Click to edit Name, Income, and Budget settings"
          >
            <span>{user.displayName}</span>
            <div className="w-6 h-6 rounded-full bg-[#E8DDD0] flex items-center justify-center text-[#554A3F]">
              <User size={13} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

