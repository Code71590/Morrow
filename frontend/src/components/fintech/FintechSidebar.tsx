import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, CreditCard, WalletCards, BarChart3, Settings, 
  Wallet, ShoppingBag
} from 'lucide-react';

export function FintechSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
      path: '/',
      isActive: location.pathname === '/',
    },
    {
      id: 'cards',
      label: 'Cards',
      icon: CreditCard,
      path: '/purchases',
      isActive: location.pathname === '/purchases',
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: WalletCards,
      path: '/purchases',
      isActive: false,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      path: '/insights',
      isActive: location.pathname === '/insights',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/preferences',
      isActive: location.pathname === '/preferences',
    },
  ];

  return (
    <aside className="w-[84px] flex-shrink-0 bg-[#F2ECE2] border-r border-[#E8DFD3] flex flex-col items-center py-6 select-none rounded-l-[28px] sm:rounded-l-[32px]">
      {/* Brand Wallet Badge */}
      <button
        onClick={() => navigate('/')}
        className="w-11 h-11 rounded-[14px] bg-[#C89B67] hover:bg-[#B8854D] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(184,133,77,0.3)] transition-all cursor-pointer group mb-7"
        title="FinTech Dashboard Home"
      >
        <Wallet size={20} className="group-hover:scale-105 transition-transform" />
      </button>

      {/* Vertical Navigation Items (Icon over Text) */}
      <nav className="flex-1 w-full flex flex-col items-center space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-[68px] py-2.5 rounded-[12px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative group ${
                item.isActive
                  ? 'bg-[#FAF7F2] text-[#2A241F] shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-semibold'
                  : 'text-[#8C7D6F] hover:text-[#2A241F] hover:bg-[#EAE1D4]/60 font-medium'
              }`}
            >
              {/* Active side indicator mark */}
              {item.isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#B8854D]" />
              )}
              <Icon
                size={19}
                className={`transition-colors ${
                  item.isActive ? 'text-[#2A241F]' : 'text-[#8C7D6F] group-hover:text-[#2A241F]'
                }`}
              />
              <span className="text-[10px] leading-none tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Subtle bottom shopping discover link */}
      <div className="pt-3 border-t border-[#E8DFD3] w-full flex flex-col items-center">
        <button
          onClick={() => navigate('/discover')}
          className="w-[68px] py-2 rounded-[12px] flex flex-col items-center justify-center gap-1 text-[#8C7D6F] hover:text-[#2A241F] hover:bg-[#EAE1D4]/60 transition-all cursor-pointer"
          title="Discover & Curated Shopping"
        >
          <ShoppingBag size={17} />
          <span className="text-[9px] font-medium leading-none">Shop</span>
        </button>
      </div>
    </aside>
  );
}

