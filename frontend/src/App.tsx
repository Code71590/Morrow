import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { ChatPanel } from '@/components/assistant/ChatPanel';
import { LoginModal } from '@/components/auth/LoginModal';
import { ProfileBudgetModal } from '@/components/profile/ProfileBudgetModal';
import { useAppStore } from '@/store/appStore';

// Pages
import { Overview } from '@/pages/Overview';
import { Discover } from '@/pages/Discover';
import { ProductDetails } from '@/pages/ProductDetails';
import { PriceWatch } from '@/pages/PriceWatch';
import { Purchases } from '@/pages/Purchases';
import { FinancialInsights } from '@/pages/FinancialInsights';
import { Preferences } from '@/pages/Preferences';
import { Onboarding } from '@/pages/Onboarding';

export default function App() {
  const { user, setIsLoginModalOpen } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    // Open login / session setup modal on first app open
    try {
      const hasStartedSession = sessionStorage.getItem('morrow_session_started');
      if (!hasStartedSession) {
        setIsLoginModalOpen(true);
      }
    } catch (_) {}
  }, [setIsLoginModalOpen]);

  if (location.pathname === '/onboarding') {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F6F3EC] font-sans text-[#2A241F] antialiased selection:bg-[#DE873E]/30 selection:text-[#2A241F]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/price-watch" element={<PriceWatch />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/insights" element={<FinancialInsights />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Mobile Tab Navigation */}
        <MobileNavigation />
      </div>

      {/* Slide-out AI Shopping Assistant Panel */}
      <ChatPanel />

      {/* Global Auth & Profile Budget Modals */}
      <LoginModal />
      <ProfileBudgetModal />
    </div>
  );
}
