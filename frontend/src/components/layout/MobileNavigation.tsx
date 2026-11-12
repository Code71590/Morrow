import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Eye, ShoppingBag, BarChart3 } from 'lucide-react';

const TAB_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Overview' },
  { to: '/discover',   icon: Search,          label: 'Discover' },
  { to: '/price-watch',icon: Eye,             label: 'Watch' },
  { to: '/purchases',  icon: ShoppingBag,     label: 'Orders' },
  { to: '/insights',   icon: BarChart3,       label: 'Insights' },
];

export function MobileNavigation() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#192923] border-t border-[#303933] safe-area-pb shadow-lg">
      <div className="flex items-stretch h-16">
        {TAB_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors cursor-pointer
              ${isActive ? 'text-[#F08A63]' : 'text-[#858A83] hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`p-1 rounded-[6px] transition-colors ${isActive ? 'bg-[#303933] text-[#F08A63]' : ''}`}>
                  <Icon size={18} />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
