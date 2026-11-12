import type { Product } from './product';

export type PurchaseMode = 'notify' | 'prepare_checkout' | 'auto_purchase';
export type WatchStatus = 'active' | 'paused' | 'triggered' | 'expired' | 'completed';

export interface PriceObservation {
  id: string;
  productId: string;
  price: number;
  currency: string;
  merchant: string;
  observedAt: string;
}

export interface PurchaseRule {
  id: string;
  priceWatchId: string;
  maxQuantity: number;
  authorized: boolean;
  authorizationNote?: string;
}

export interface PriceWatch {
  id: string;
  productId: string;
  product: Product;
  targetPrice: number;
  maximumTotalPrice: number;
  currency: string;
  purchaseMode: PurchaseMode;
  sellerRequirement?: string;
  affordabilityRequired: boolean;
  expirationDate?: string;
  status: WatchStatus;
  initialPrice: number;
  currentPrice: number;
  priceHistory: PriceObservation[];
  rule?: PurchaseRule;
  lastCheckedAt: string;
  createdAt: string;
}
