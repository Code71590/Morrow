import type { CurrencyCode } from './user';

export interface FinancialProfile {
  id: string;
  userId: string;
  monthlyIncome: number;
  currency: CurrencyCode;
  essentialExpenses: number;
  savingsCommitment: number;
  upcomingCommitments: number;
  safetyReserve: number;
  availableFunds: number;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
  currency: string;
}

export type AffordabilityDecision = 'COMFORTABLE' | 'WITHIN_BUDGET' | 'BUDGET_STRAIN' | 'NOT_RECOMMENDED' | 'INSUFFICIENT_DATA';

export interface AffordabilityResult {
  purchaseAmount: number;
  discretionaryBudget: number;
  remainingAfterPurchase: number;
  budgetPercentageUsed: number;
  decision: AffordabilityDecision;
  explanation: string;
  currency: string;
}

export interface MonthlyExpenseSummary {
  month: string;
  year: number;
  monthName: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  byCategory: Record<string, number>;
}
