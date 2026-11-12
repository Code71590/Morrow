import { DEMO_FINANCIAL_PROFILE, DEMO_BUDGETS, DEMO_MONTHLY_SUMMARIES } from '@/data/demoData';
import { assessAffordability, calculateDiscretionary } from '@/utils/affordability';

function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

export const mockFinancialService = {
  async getProfile() { await delay(100); return { ...DEMO_FINANCIAL_PROFILE }; },
  async getBudgets() { await delay(100); return [...DEMO_BUDGETS]; },
  async getMonthlySummaries() { await delay(150); return [...DEMO_MONTHLY_SUMMARIES]; },
  async getDiscretionaryBudget() {
    await delay(50);
    return calculateDiscretionary(DEMO_FINANCIAL_PROFILE);
  },
  async assessAffordability(cost: number) {
    await delay(100);
    return assessAffordability(cost, DEMO_FINANCIAL_PROFILE);
  },
};

