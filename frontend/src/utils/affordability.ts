import type { FinancialProfile, AffordabilityResult, AffordabilityDecision } from '@/types/financial';
import { getCurrencySymbol } from './currency';

export function calculateDiscretionary(profile: FinancialProfile): number {
  return Math.max(0,
    profile.availableFunds
    - profile.essentialExpenses
    - profile.savingsCommitment
    - profile.upcomingCommitments
    - profile.safetyReserve
  );
}

export function assessAffordability(cost: number, profile: FinancialProfile): AffordabilityResult {
  const discretionary = calculateDiscretionary(profile);
  const remaining = discretionary - cost;
  const percentUsed = discretionary > 0 ? (cost / discretionary) * 100 : 100;
  const sym = getCurrencySymbol(profile.currency);

  let decision: AffordabilityDecision;
  let explanation: string;

  if (discretionary <= 0) {
    decision = 'INSUFFICIENT_DATA';
    explanation = 'Unable to assess affordability — no discretionary budget data available.';
  } else if (percentUsed <= 30) {
    decision = 'COMFORTABLE';
    explanation = `This purchase uses only ${Math.round(percentUsed)}% of your discretionary budget (${sym}${Math.round(discretionary).toLocaleString()}), leaving ${sym}${Math.round(remaining).toLocaleString()} available.`;
  } else if (percentUsed <= 60) {
    decision = 'WITHIN_BUDGET';
    explanation = `This purchase fits your budget, using ${Math.round(percentUsed)}% of your ${sym}${Math.round(discretionary).toLocaleString()} discretionary budget. You'll have ${sym}${Math.round(remaining).toLocaleString()} left.`;
  } else if (percentUsed <= 90) {
    decision = 'BUDGET_STRAIN';
    explanation = `This purchase would use ${Math.round(percentUsed)}% of your discretionary budget, leaving only ${sym}${Math.round(remaining).toLocaleString()}. Consider waiting or choosing a cheaper alternative.`;
  } else {
    decision = 'NOT_RECOMMENDED';
    explanation = `This purchase ${remaining < 0 ? 'exceeds' : 'nearly exhausts'} your discretionary budget of ${sym}${Math.round(discretionary).toLocaleString()}. It's not recommended at this time.`;
  }

  return {
    purchaseAmount: cost,
    discretionaryBudget: discretionary,
    remainingAfterPurchase: remaining,
    budgetPercentageUsed: Math.round(percentUsed),
    decision,
    explanation,
    currency: profile.currency,
  };
}
