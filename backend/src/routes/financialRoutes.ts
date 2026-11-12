import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { financialDecisionService } from '../services/financialDecisionService.js';
import prisma from '../config/prisma.js';

export const financialRouter = Router();

const evaluateSchema = z.object({
  productId: z.string().optional(),
  proposedTotal: z.number().positive('Proposed total must be greater than zero'),
  currency: z.string().default('USD'),
});

const profileUpdateSchema = z.object({
  currency: z.string().optional(),
  monthlyIncome: z.number().optional(),
  availableFunds: z.number().optional(),
  essentialExpenses: z.number().optional(),
  savingsCommitment: z.number().optional(),
  safetyReserve: z.number().optional(),
});

/**
 * GET /api/finance/summary
 * Real-time discretionary calculation and budget ledger summary
 */
financialRouter.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await prisma.financialProfile.findUnique({
      where: { demoUserId: req.demoUserId },
    });

    if (!profile) {
      res.status(404).json({ success: false, error: 'Financial profile not found' });
      return;
    }

    const discretionary = financialDecisionService.calculateDiscretionaryBudget(profile);

    // Sum recent expenses
    const recentExpenses = await prisma.financialTransaction.findMany({
      where: {
        demoUserId: req.demoUserId,
        transactionType: 'expense',
      },
    });

    const totalSpent = recentExpenses.reduce((sum, tx) => sum + tx.amount, 0);

    res.json({
      success: true,
      data: {
        currency: profile.currency,
        monthlyIncome: profile.monthlyIncome,
        availableFunds: profile.availableFunds,
        essentialExpenses: profile.essentialExpenses,
        savingsCommitment: profile.savingsCommitment,
        safetyReserve: profile.safetyReserve,
        discretionaryBudget: discretionary,
        totalExpenses: totalSpent,
        spendingProgressPercentage: profile.monthlyIncome > 0
          ? Math.min(100, Math.round((totalSpent / profile.monthlyIncome) * 100))
          : 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/finance/profile
 * Update user budget numbers from profile modal
 */
financialRouter.patch('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = profileUpdateSchema.parse(req.body);
    const updated = await prisma.financialProfile.upsert({
      where: { demoUserId: req.demoUserId },
      update: updates,
      create: {
        demoUserId: req.demoUserId,
        currency: updates.currency || 'USD',
        monthlyIncome: updates.monthlyIncome || 6500,
        availableFunds: updates.availableFunds || updates.monthlyIncome || 6500,
        essentialExpenses: updates.essentialExpenses || 3200,
        savingsCommitment: updates.savingsCommitment || 1000,
        safetyReserve: updates.safetyReserve || 500,
      },
    });

    const discretionary = financialDecisionService.calculateDiscretionaryBudget(updated);
    res.json({
      success: true,
      data: {
        ...updated,
        discretionaryBudget: discretionary,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/finance/transactions
 * List all verified transactions for AG Grid table
 */
financialRouter.get('/transactions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await prisma.financialTransaction.findMany({
      where: { demoUserId: req.demoUserId },
      orderBy: { transactionDate: 'desc' },
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/finance/evaluate-purchase
 * Deterministic purchase affordability calculation
 */
financialRouter.post('/evaluate-purchase', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { proposedTotal, currency } = evaluateSchema.parse(req.body);
    const profile = await prisma.financialProfile.findUnique({
      where: { demoUserId: req.demoUserId },
    });

    if (!profile) {
      res.status(404).json({ success: false, error: 'Financial profile not found' });
      return;
    }

    const evaluation = financialDecisionService.evaluatePurchase(profile, proposedTotal, currency);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/finance/insights
 * Category breakdown and cash flow metrics
 */
financialRouter.get('/insights', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await prisma.financialProfile.findUnique({
      where: { demoUserId: req.demoUserId },
    });

    const transactions = await prisma.financialTransaction.findMany({
      where: { demoUserId: req.demoUserId },
      orderBy: { transactionDate: 'desc' },
    });

    const categoryBreakdown: Record<string, number> = {};
    for (const tx of transactions) {
      if (tx.transactionType === 'expense') {
        categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;
      }
    }

    res.json({
      success: true,
      data: {
        profile,
        categoryBreakdown,
        totalTransactions: transactions.length,
      },
    });
  } catch (error) {
    next(error);
  }
});
