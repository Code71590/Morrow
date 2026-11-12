export type TransactionCategory =
  | 'Shopping' | 'Food & Dining' | 'Transport' | 'Entertainment'
  | 'Healthcare' | 'Utilities' | 'Rent' | 'Savings' | 'Income'
  | 'Subscription' | 'Education' | 'Travel' | 'Other';

export type TransactionType = 'income' | 'expense' | 'transfer';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash' | 'PayPal' | 'Auto-debit';

export interface Transaction {
  id: string;
  description: string;
  category: TransactionCategory;
  merchant: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  transactionDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  source?: 'manual' | 'auto' | 'paypal' | 'import';
  notes?: string;
}
