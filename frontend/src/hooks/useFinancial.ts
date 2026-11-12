import { useState, useEffect, useCallback } from 'react';
import { financeService } from '@/services/api/financeService';
import type { AffordabilityResult, Budget, MonthlyExpenseSummary } from '@/types/financial';

export function useFinancial() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlyExpenseSummary[]>([]);
  const [discretionary, setDiscretionary] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      financeService.getBudgets(),
      financeService.getMonthlySummaries(),
      financeService.getDiscretionaryBudget(),
    ]).then(([b, m, d]) => {
      setBudgets(b);
      setMonthlySummaries(m);
      setDiscretionary(d);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const checkAffordability = useCallback(async (cost: number): Promise<AffordabilityResult> => {
    return financeService.assessAffordability(cost);
  }, []);

  return { budgets, monthlySummaries, discretionary, isLoading, checkAffordability };
}

