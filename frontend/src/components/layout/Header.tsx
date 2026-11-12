import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Heart, Settings, User, LogOut, LogIn, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { MorrowLogo } from '@/components/common/MorrowLogo';
import { getInitials } from '@/utils/formatting';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { 
    user, setChatOpen, chatOpen, isLoggedIn, logout, 
    setIsLoginModalOpen, setIsProfileModalOpen,
    sidebarCollapsed, toggleSidebar 
  } = useAppStore();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F6F4EE]/95 backdrop-blur-md border-b border-[#E9E6DE]">
        <div className="flex items-center justify-between px-6 md:px-9 lg:px-10 h-16 max-w-[1320px] mx-auto">
          {/* Left Side: Context / Date & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 rounded-[8px] text-[#858A83] hover:text-[#192923] hover:bg-[#E9E6DE]/60 transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            <button
              onClick={() => navigate('/')}
              className="lg:hidden flex items-center gap-2 cursor-pointer"
            >
              <MorrowLogo className="w-8 h-8" />
              <span className="text-base font-bold font-heading text-[#192923] tracking-tight">Morrow</span>
            </button>
            <div className="hidden lg:flex items-center gap-2.5 text-xs text-[#858A83]">
              <span className="font-semibold text-[#242C27]">November 2026</span>
              <span>·</span>
              <span className="text-[11px] font-medium text-[#858A83]">Smart Shopping & Cash Flow Companion</span>
            </div>
          </div>

          {/* Right Side: Demo Indicator, Profile Pill & Ask Morrow Action */}
          <div className="flex items-center gap-3">
            
            {/* Profile & Budget Clickable Trigger */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-white border border-[#E9E6DE] hover:border-[#192923]/30 hover:bg-[#FAF7F2] text-xs transition-all cursor-pointer shadow-xs group"
                  title="Click to change your Name, Income, and Budget settings"
                >
                  <div className="w-6 h-6 rounded-full bg-[#192923] text-white flex items-center justify-center text-[10px] font-bold group-hover:scale-105 transition-transform">
                    {getInitials(user.displayName)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-[#192923] block leading-none">{user.displayName}</span>
                    <span className="text-[9px] text-[#858A83] block leading-none mt-0.5">Budget Settings</span>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white border border-[#E9E6DE] text-xs font-semibold text-[#192923] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <LogIn size={14} className="text-[#F08A63]" />
                <span>Log In</span>
              </button>
            )}

            {/* Ask Morrow AI Assistant */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="flex items-center gap-2 h-10 px-4 rounded-[10px] bg-[#192923] text-white text-xs font-semibold hover:bg-[#24352D] active:bg-[#14201B] transition-colors cursor-pointer shadow-xs"
              title="Open Morrow AI Shopping Assistant"
            >
              <Sparkles size={14} className="text-[#F08A63]" />
              <span className="hidden sm:inline">Ask Morrow</span>
            </button>

            {/* Logout Quick Action (desktop) */}
            {isLoggedIn && (
              <button
                onClick={logout}
                className="hidden md:flex p-2 rounded-[8px] text-[#858A83] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-[8px] text-[#242C27] hover:bg-[#E9E6DE]/60 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-xs"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-16 left-0 right-0 bg-[#F6F4EE] border-b border-[#E9E6DE] p-5 space-y-2 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-semibold text-[#242C27] bg-white border border-[#E9E6DE] shadow-xs text-left"
            >
              <User size={16} className="text-[#F08A63]" />
              <span>Edit Profile & Budget ({user.displayName})</span>
            </button>

            <NavLink to="/preferences" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-medium text-[#242C27] hover:bg-white border border-transparent hover:border-[#E9E6DE]">
              <Heart size={16} className="text-[#858A83]" /> Personalization & Preferences
            </NavLink>

            <NavLink to="/preferences" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-medium text-[#242C27] hover:bg-white border border-transparent hover:border-[#E9E6DE]">
              <Settings size={16} className="text-[#858A83]" /> Demo Controls & AI Engine
            </NavLink>

            <div className="pt-3 border-t border-[#E9E6DE] flex items-center justify-between text-xs text-[#858A83]">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="text-rose-600 font-semibold flex items-center gap-1.5"
                >
                  <LogOut size={13} />
                  <span>Log Out ({user.displayName})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="text-[#192923] font-semibold flex items-center gap-1.5"
                >
                  <LogIn size={13} />
                  <span>Log In</span>
                </button>
              )}
              <span>Currency: <strong className="text-[#242C27]">{user.currency} (₹)</strong></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
