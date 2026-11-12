import { apiRequest } from './apiClient';

export interface PayPalConfig {
  clientId: string;
  currency: string;
  env: string;
  configured: boolean;
}

export const paymentService = {
  getConfig: async (): Promise<PayPalConfig> => {
    return apiRequest<PayPalConfig>('/api/paypal/config');
  },

  createOrder: async (productId: string, quantity = 1) => {
    return apiRequest<{
      orderId: string;
      internalReference: string;
      totalAmount: number;
      currency: string;
    }>('/api/paypal/orders', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  captureOrder: async (orderId: string) => {
    return apiRequest<{
      success: boolean;
      orderId: string;
      captureId: string;
      status: string;
      amount: number;
      currency: string;
    }>(`/api/paypal/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
    });
  },

  getPurchases: async () => {
    return apiRequest<any[]>('/api/purchases');
  },
};
