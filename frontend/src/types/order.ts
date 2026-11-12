export type OrderStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  merchant: string;
  totalAmount: number;
  currency: string;
  paypalOrderId?: string;
  orderStatus: OrderStatus;
  source: 'manual' | 'auto_buy' | 'price_watch';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}
