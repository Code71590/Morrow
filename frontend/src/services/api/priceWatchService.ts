import { apiRequest } from './apiClient';

export const priceWatchService = {
  list: async () => {
    return apiRequest<any[]>('/api/price-watches');
  },

  create: async (data: {
    productId: string;
    targetPrice: number;
    maximumTotalPrice?: number;
    purchaseMode?: 'notify' | 'auto_purchase';
  }) => {
    return apiRequest('/api/price-watches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  pause: async (id: string) => {
    return apiRequest(`/api/price-watches/${encodeURIComponent(id)}/pause`, {
      method: 'POST',
    });
  },

  resume: async (id: string) => {
    return apiRequest(`/api/price-watches/${encodeURIComponent(id)}/resume`, {
      method: 'POST',
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/price-watches/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  simulateDrop: async () => {
    return apiRequest('/api/demo/simulate-drop', {
      method: 'POST',
    });
  },
};
