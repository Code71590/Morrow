import { apiRequest } from './apiClient';
import { mockFinancialService } from '../mock/financial.mock';

export const financeService = {
  ...mockFinancialService,

  getSummary: async () => {
    try {
      return await apiRequest('/api/finance/summary');
    } catch {
      return mockFinancialService.getProfile();
    }
  },

  getTransactions: async () => {
    try {
      return await apiRequest('/api/finance/transactions');
    } catch {
      return [];
    }
  },

  evaluatePurchase: async (proposedTotal: number, currency = 'USD', productId?: string) => {
    try {
      return await apiRequest('/api/finance/evaluate-purchase', {
        method: 'POST',
        body: JSON.stringify({ proposedTotal, currency, productId }),
      });
    } catch (err) {
      console.warn('Backend evaluatePurchase call failed, using local calculation:', err);
      return mockFinancialService.assessAffordability(proposedTotal);
    }
  },

  updateProfile: async (data: any) => {
    try {
      return await apiRequest('/api/finance/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn('Backend updateProfile failed:', err);
      return null;
    }
  },

  getInsights: async () => {
    try {
      return await apiRequest('/api/finance/insights');
    } catch {
      return null;
    }
  },
};
