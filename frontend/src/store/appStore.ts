import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, CurrencyCode } from '@/types/user';
import type { FinancialProfile } from '@/types/financial';
import type { Transaction } from '@/types/transaction';
import type { PriceWatch } from '@/types/priceWatch';
import type { Memory } from '@/types/memory';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import {
  DEMO_USER, DEMO_FINANCIAL_PROFILE, DEMO_TRANSACTIONS,
  DEMO_PRICE_WATCHES, DEMO_MEMORIES, DEMO_ORDERS,
} from '@/data/demoData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLoading?: boolean;
  action?: string;
  relatedProducts?: Product[];
}

interface DemoSettings {
  aiMode: boolean;
  showDemoLabels: boolean;
}

interface AppState {
  user: UserProfile;
  financialProfile: FinancialProfile;
  transactions: Transaction[];
  priceWatches: PriceWatch[];
  memories: Memory[];
  orders: Order[];
  chatOpen: boolean;
  chatMessages: ChatMessage[];
  currentConversationId: string | null;
  demoSettings: DemoSettings;
  cartProduct: Product | null;
  isLoggedIn: boolean;
  isProfileModalOpen: boolean;
  isLoginModalOpen: boolean;
  sidebarCollapsed: boolean;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (name: string, income: number, currency: CurrencyCode, essentialExpenses?: number, savingsCommitment?: number, resetToZero?: boolean) => void;
  logout: () => void;
  updateUserAndBudget: (data: {
    name: string;
    currency: CurrencyCode;
    monthlyIncome: number;
    essentialExpenses: number;
    savingsCommitment: number;
    safetyReserve?: number;
  }) => void;

  setUser: (user: Partial<UserProfile>) => void;
  setUserCurrency: (currency: CurrencyCode) => void;
  completeOnboarding: (name: string, currency: CurrencyCode, country: string, income: number) => void;
  updateFinancialProfile: (profile: Partial<FinancialProfile>) => void;

  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;

  addPriceWatch: (pw: PriceWatch) => void;
  updatePriceWatch: (id: string, updates: Partial<PriceWatch>) => void;
  deletePriceWatch: (id: string) => void;

  addMemory: (memory: Memory) => void;
  updateMemory: (id: string, content: string) => void;
  deleteMemory: (id: string) => void;
  clearMemories: () => void;

  addOrder: (order: Order) => void;
  recordPurchase: (order: Order, transaction: Transaction, amount: number) => void;

  setChatOpen: (open: boolean) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateLastMessage: (updates: Partial<ChatMessage>) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setCurrentConversationId: (id: string | null) => void;
  startNewChat: () => void;
  clearChat: () => void;

  setCartProduct: (product: Product | null) => void;
  toggleAiMode: () => void;
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: DEMO_USER,
      financialProfile: DEMO_FINANCIAL_PROFILE,
      transactions: DEMO_TRANSACTIONS,
      priceWatches: DEMO_PRICE_WATCHES,
      memories: DEMO_MEMORIES,
      orders: DEMO_ORDERS,
      chatOpen: false,
      chatMessages: [],
      currentConversationId: null,
      demoSettings: { aiMode: true, showDemoLabels: true },
      cartProduct: null,
      isLoggedIn: true,
      isProfileModalOpen: false,
      isLoginModalOpen: false,
      sidebarCollapsed: false,

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setIsProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
      setIsLoginModalOpen: (open) => set({ isLoginModalOpen: open }),

      login: (name, income, currency, essentialExpenses, savingsCommitment, resetToZero = false) => {
        try {
          sessionStorage.setItem('morrow_session_started', 'true');
        } catch (_) {}
        set((s) => ({
          isLoggedIn: true,
          isLoginModalOpen: false,
          user: {
            ...s.user,
            displayName: name || 'Alex',
            monthlyIncome: income || s.user.monthlyIncome,
            currency: currency || s.user.currency,
          },
          transactions: resetToZero ? [] : s.transactions,
          orders: resetToZero ? [] : s.orders,
          financialProfile: {
            ...s.financialProfile,
            currency: currency || s.financialProfile.currency,
            monthlyIncome: income || s.financialProfile.monthlyIncome,
            availableFunds: income || s.financialProfile.availableFunds,
            essentialExpenses: essentialExpenses !== undefined ? essentialExpenses : s.financialProfile.essentialExpenses,
            savingsCommitment: savingsCommitment !== undefined ? savingsCommitment : s.financialProfile.savingsCommitment,
          },
        }));
      },

      logout: () => {
        try {
          sessionStorage.removeItem('morrow_session_started');
        } catch (_) {}
        set({
          isLoggedIn: false,
          isProfileModalOpen: false,
          isLoginModalOpen: true,
        });
      },

      updateUserAndBudget: ({ name, currency, monthlyIncome, essentialExpenses, savingsCommitment, safetyReserve }) =>
        set((s) => ({
          user: {
            ...s.user,
            displayName: name,
            currency,
            monthlyIncome,
          },
          financialProfile: {
            ...s.financialProfile,
            currency,
            monthlyIncome,
            essentialExpenses,
            savingsCommitment,
            safetyReserve: safetyReserve !== undefined ? safetyReserve : s.financialProfile.safetyReserve,
            availableFunds: monthlyIncome,
          },
        })),

      setUser: (updates) =>
        set((s) => ({ user: { ...s.user, ...updates } })),

      setUserCurrency: (currency) =>
        set((s) => ({
          user: { ...s.user, currency },
          financialProfile: { ...s.financialProfile, currency },
        })),

      completeOnboarding: (name, currency, country, income) =>
        set((s) => ({
          user: { ...s.user, displayName: name, currency, country, monthlyIncome: income, hasCompletedOnboarding: true },
          financialProfile: { ...s.financialProfile, currency, monthlyIncome: income, availableFunds: income },
        })),

      updateFinancialProfile: (updates) =>
        set((s) => ({ financialProfile: { ...s.financialProfile, ...updates } })),

      addTransaction: (tx) =>
        set((s) => ({ transactions: [tx, ...s.transactions] })),

      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t),
        })),

      addPriceWatch: (pw) =>
        set((s) => ({ priceWatches: [pw, ...s.priceWatches] })),

      updatePriceWatch: (id, updates) =>
        set((s) => ({
          priceWatches: s.priceWatches.map(pw => pw.id === id ? { ...pw, ...updates } : pw),
        })),

      deletePriceWatch: (id) =>
        set((s) => ({ priceWatches: s.priceWatches.filter(pw => pw.id !== id) })),

      addMemory: (memory) =>
        set((s) => ({ memories: [memory, ...s.memories] })),

      updateMemory: (id, content) =>
        set((s) => ({
          memories: s.memories.map(m =>
            m.id === id ? { ...m, content, updatedAt: new Date().toISOString() } : m
          ),
        })),

      deleteMemory: (id) =>
        set((s) => ({ memories: s.memories.filter(m => m.id !== id) })),

      clearMemories: () => set({ memories: [] }),

      addOrder: (order) =>
        set((s) => ({ orders: [order, ...s.orders] })),

      recordPurchase: (order, transaction, amount) =>
        set((s) => ({
          orders: [order, ...s.orders],
          transactions: [transaction, ...s.transactions],
          financialProfile: {
            ...s.financialProfile,
            availableFunds: Math.max(0, s.financialProfile.availableFunds - amount),
          },
        })),

      setChatOpen: (open) => set({ chatOpen: open }),

      addChatMessage: (message) =>
        set((s) => ({ chatMessages: [...s.chatMessages, message] })),

      updateLastMessage: (updates) =>
        set((s) => {
          const msgs = [...s.chatMessages];
          if (msgs.length > 0) {
            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], ...updates };
          }
          return { chatMessages: msgs };
        }),

      setChatMessages: (messages) => set({ chatMessages: messages }),

      setCurrentConversationId: (id) => set({ currentConversationId: id }),

      startNewChat: () =>
        set({
          currentConversationId: null,
          chatMessages: [],
        }),

      clearChat: () => set({ chatMessages: [], currentConversationId: null }),

      setCartProduct: (product) => set({ cartProduct: product }),

      toggleAiMode: () =>
        set((s) => ({
          demoSettings: { ...s.demoSettings, aiMode: !s.demoSettings.aiMode },
        })),

      resetDemoData: () =>
        set({
          user: { ...DEMO_USER, hasCompletedOnboarding: true },
          financialProfile: DEMO_FINANCIAL_PROFILE,
          transactions: DEMO_TRANSACTIONS,
          priceWatches: DEMO_PRICE_WATCHES,
          memories: DEMO_MEMORIES,
          orders: DEMO_ORDERS,
          chatMessages: [],
          cartProduct: null,
          demoSettings: { aiMode: true, showDemoLabels: true },
        }),
    }),
    { name: 'morrow-demo-state-v4' }
  )
);
