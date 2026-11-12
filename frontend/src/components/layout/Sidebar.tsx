import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Eye, ShoppingBag, BarChart3, 
  Heart, Brain, Settings, RotateCcw, LogOut, ChevronLeft, ChevronRight,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { getInitials } from '@/utils/formatting';
import { MorrowLogo } from '@/components/common/MorrowLogo';

const NAV_ITEMS = [
  { to: '/',            icon: LayoutDashboard, label: 'Overview' },
  { to: '/discover',    icon: Search,          label: 'Discover' },
  { to: '/price-watch', icon: Eye,             label: 'Price Watch' },
  { to: '/purchases',   icon: ShoppingBag,     label: 'My Purchases' },
  { to: '/insights',    icon: BarChart3,       label: 'Financial Insights' },
  { to: '/preferences', icon: Heart,           label: 'Personalization' },
];

export function Sidebar() {
  const { 
    user, financialProfile, demoSettings, toggleAiMode, 
    resetDemoData, setIsProfileModalOpen, logout,
    sidebarCollapsed, toggleSidebar 
  } = useAppStore();
  const navigate = useNavigate();

  return (
    <aside 
      className={`hidden lg:flex flex-col min-h-screen bg-[#192923] text-[#F6F4EE] flex-shrink-0 select-none border-r border-[#303933] transition-all duration-300 ease-in-out relative ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[245px]'
      }`}
    >
      {/* Brand & Collapse Header */}
      <div className={`py-4 border-b border-[#303933]/70 flex items-center transition-all ${
        sidebarCollapsed ? 'px-3 justify-center' : 'px-4 justify-between'
      }`}>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-95 transition-opacity text-left cursor-pointer group min-w-0"
          title="Morrow Home"
        >
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
            <MorrowLogo className="w-10 h-10" />
          </div>
          
          {!sidebarCollapsed && (
            <div className="min-w-0 animate-in fade-in duration-200">
              <span className="text-xl font-bold font-heading tracking-tight block leading-none text-white">Morrow</span>
              <span className="text-[10px] text-[#858A83] tracking-wider uppercase font-semibold mt-1 block">Shopping & Finance</span>
            </div>
          )}
        </button>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-[8px] text-[#858A83] hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
            sidebarCollapsed ? 'mt-2 hidden' : ''
          }`}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* When collapsed: Dedicated expand button below logo */}
      {sidebarCollapsed && (
        <div className="flex justify-center py-2 border-b border-[#303933]/40">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-[8px] text-[#858A83] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className={`flex-1 py-3.5 space-y-1.5 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={sidebarCollapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-[10px] text-xs transition-all duration-150 group cursor-pointer relative ${
                sidebarCollapsed 
                  ? 'justify-center w-11 h-10 mx-auto' 
                  : 'justify-between px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-[#303933] text-white font-semibold shadow-xs'
                  : 'text-[#858A83] hover:text-[#F6F4EE] hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon 
                    size={17} 
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#F08A63]' : 'text-[#858A83] group-hover:text-white'
                    }`} 
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate">{label}</span>
                  )}
                </div>

                {!sidebarCollapsed && isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F08A63] flex-shrink-0" />
                )}

                {/* Collapsed active dot badge */}
                {sidebarCollapsed && isActive && (
                  <span className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-[#F08A63]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Quiet Section */}
      <div className={`pb-4 border-t border-[#303933]/70 pt-2.5 space-y-1.5 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
        
        {/* AI Engine Status */}
        <button
          onClick={toggleAiMode}
          className={`w-full flex items-center rounded-[9px] text-xs text-[#858A83] hover:text-white hover:bg-white/5 transition-all cursor-pointer ${
            sidebarCollapsed ? 'justify-center h-10 w-11 mx-auto' : 'justify-between px-3 py-2'
          }`}
          title={sidebarCollapsed ? `AI Engine: ${demoSettings.aiMode ? 'GEMINI' : 'DEMO'}` : 'Toggle deterministic engine vs Gemini Flash'}
        >
          <div className="flex items-center gap-2">
            <Brain size={16} className={demoSettings.aiMode ? "text-[#F08A63]" : "text-[#858A83]"} />
            {!sidebarCollapsed && <span>AI Engine</span>}
          </div>

          {!sidebarCollapsed && (
            <span className={`text-[9px] px-2 py-0.5 rounded-[5px] font-bold tracking-wider uppercase transition-all ${
              demoSettings.aiMode 
                ? 'bg-[#F08A63] text-white' 
                : 'bg-white/10 text-white/50'
            }`}>
              {demoSettings.aiMode ? 'GEMINI' : 'DEMO'}
            </span>
          )}
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo state to fresh INR mock transactions, price watches, and personalization?')) {
              resetDemoData();
            }
          }}
          className={`w-full flex items-center rounded-[9px] text-[11px] text-[#858A83]/70 hover:text-rose-300 hover:bg-white/5 transition-all cursor-pointer ${
            sidebarCollapsed ? 'justify-center h-10 w-11 mx-auto' : 'gap-2 px-3 py-1.5 text-left'
          }`}
          title="Reset Demo Data"
        >
          <RotateCcw size={14} className="opacity-70" />
          {!sidebarCollapsed && <span>Reset Demo Data</span>}
        </button>

        {/* User Profile Card (Clickable to edit profile & budget) */}
        <div className={`pt-2 mt-1 border-t border-[#303933]/50 flex items-center ${
          sidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between px-2'
        }`}>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className={`flex items-center gap-2.5 min-w-0 hover:opacity-90 text-left cursor-pointer group ${
              sidebarCollapsed ? 'justify-center' : 'flex-1'
            }`}
            title={`Click to edit Name and Budget (${user.displayName})`}
          >
            <div className="w-8 h-8 rounded-full bg-[#303933] text-[#F08A63] flex items-center justify-center text-xs font-bold border border-white/10 group-hover:border-[#F08A63]/50 transition-colors">
              {getInitials(user.displayName)}
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-white block truncate group-hover:text-[#F08A63] transition-colors">
                  {user.displayName}
                </span>
                <span className="text-[10px] text-[#858A83] block truncate">
                  {user.currency} (₹) · Budget
                </span>
              </div>
            )}
          </button>

          <button
            onClick={logout}
            className="p-1.5 rounded-[7px] text-[#858A83] hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
