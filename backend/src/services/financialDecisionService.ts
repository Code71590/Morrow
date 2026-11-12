export type AffordabilityDecision =
  | 'COMFORTABLE'
  | 'WITHIN_BUDGET'
  | 'BUDGET_STRAIN'
  | 'NOT_RECOMMENDED'
  | 'INSUFFICIENT_DATA'
  | 'CURRENCY_MISMATCH';

export interface FinancialProfileSnapshot {
  currency: string;
  monthlyIncome: number;
  availableFunds: number;
  essentialExpenses: number;
  savingsCommitment: number;
  safetyReserve: number;
  upcomingCommitments?: number;
}

export interface AffordabilityEvaluation {
  decision: AffordabilityDecision;
  discretionaryBudget: number;
  proposedTotal: number;
  postPurchaseBudget: number;
  currency: string;
  explanation: string;
  metrics: {
    availableFunds: number;
    essentialExpenses: number;
    savingsCommitment: number;
    safetyReserve: number;
    discretionaryRatio: number;
    postPurchaseRatio: number;
  };
}

export class FinancialDecisionService {
  /**
   * Deterministic calculation of discretionary runway:
   * Discretionary = Available Funds - Essential Expenses - Savings Commitments - User-defined Safety Reserve - Upcoming Commitments
   */
  public calculateDiscretionaryBudget(profile: FinancialProfileSnapshot): number {
    const upcoming = profile.upcomingCommitments || 0;
    const reserved = profile.essentialExpenses + profile.savingsCommitment + profile.safetyReserve + upcoming;
    return Math.max(0, profile.availableFunds - reserved);
  }

  /**
   * Evaluate whether a purchase fits within user's discretionary budget.
   */
  public evaluatePurchase(
    profile: FinancialProfileSnapshot,
    proposedTotal: number,
    purchaseCurrency: string
  ): AffordabilityEvaluation {
    if (!profile || profile.monthlyIncome <= 0) {
      return {
        decision: 'INSUFFICIENT_DATA',
        discretionaryBudget: 0,
        proposedTotal,
        postPurchaseBudget: 0,
        currency: purchaseCurrency,
        explanation: 'Your financial profile is not yet configured or monthly income is zero.',
        metrics: {
          availableFunds: profile?.availableFunds || 0,
          essentialExpenses: profile?.essentialExpenses || 0,
          savingsCommitment: profile?.savingsCommitment || 0,
          safetyReserve: profile?.safetyReserve || 0,
          discretionaryRatio: 0,
          postPurchaseRatio: 0,
        },
      };
    }

    // Check currency alignment - do not invent exchange rates
    if (profile.currency.toUpperCase() !== purchaseCurrency.toUpperCase()) {
      return {
        decision: 'CURRENCY_MISMATCH',
        discretionaryBudget: this.calculateDiscretionaryBudget(profile),
        proposedTotal,
        postPurchaseBudget: 0,
        currency: purchaseCurrency,
        explanation: `Purchase is priced in ${purchaseCurrency.toUpperCase()}, but your financial ledger is tracked in ${profile.currency.toUpperCase()}. Without a verified real-time exchange rate, automated affordability cannot be calculated.`,
        metrics: {
          availableFunds: profile.availableFunds,
          essentialExpenses: profile.essentialExpenses,
          savingsCommitment: profile.savingsCommitment,
          safetyReserve: profile.safetyReserve,
          discretionaryRatio: 0,
          postPurchaseRatio: 0,
        },
      };
    }

    const discretionary = this.calculateDiscretionaryBudget(profile);
    const postPurchase = discretionary - proposedTotal;
    const discretionaryRatio = discretionary > 0 ? proposedTotal / discretionary : 1;
    const postPurchaseRatio = discretionary > 0 ? Math.max(0, postPurchase) / discretionary : 0;

    let decision: AffordabilityDecision;
    let explanation: string;

    if (postPurchase < 0) {
      decision = 'NOT_RECOMMENDED';
      explanation = `This purchase of ${profile.currency} ${proposedTotal.toLocaleString()} exceeds your remaining discretionary budget (${profile.currency} ${discretionary.toLocaleString()}) by ${profile.currency} ${Math.abs(postPurchase).toLocaleString()}. Buying now will eat into protected savings or fixed commitments.`;
    } else if (discretionaryRatio > 0.65) {
      decision = 'BUDGET_STRAIN';
      explanation = `This purchase consumes ${(discretionaryRatio * 100).toFixed(0)}% of your remaining discretionary runway, leaving ${profile.currency} ${postPurchase.toLocaleString()}. It is possible, but will limit flexibility for the rest of the month.`;
    } else if (discretionaryRatio > 0.35) {
      decision = 'WITHIN_BUDGET';
      explanation = `This purchase fits comfortably within your monthly allowance. After spending ${profile.currency} ${proposedTotal.toLocaleString()}, you will still retain ${profile.currency} ${postPurchase.toLocaleString()} in safe discretionary runway.`;
    } else {
      decision = 'COMFORTABLE';
      explanation = `Safe to buy! This purchase uses only ${(discretionaryRatio * 100).toFixed(0)}% of your discretionary funds, leaving a healthy buffer of ${profile.currency} ${postPurchase.toLocaleString()}.`;
    }

    return {
      decision,
      discretionaryBudget: discretionary,
      proposedTotal,
      postPurchaseBudget: postPurchase,
      currency: profile.currency,
      explanation,
      metrics: {
        availableFunds: profile.availableFunds,
        essentialExpenses: profile.essentialExpenses,
        savingsCommitment: profile.savingsCommitment,
        safetyReserve: profile.safetyReserve,
        discretionaryRatio,
        postPurchaseRatio,
      },
    };
  }
}

export const financialDecisionService = new FinancialDecisionService();
