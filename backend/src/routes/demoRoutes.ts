import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma.js';
import { integrationStatus } from '../config/env.js';
import { mem0Service } from '../services/mem0Service.js';
import { priceWatchService } from '../services/priceWatchService.js';

export const demoRouter = Router();

/**
 * GET /api/health/integrations
 * Non-sensitive health and configuration status check
 */
demoRouter.get('/health/integrations', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    demoUserId: req.demoUserId,
    integrations: integrationStatus(),
  });
});

/**
 * POST /api/demo/reset
 * Clears current demo user's memory, price watches, orders, transactions, and session
 */
demoRouter.post('/demo/reset', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.demoUserId;

    // 1. Clear Mem0 memory if configured
    if (mem0Service.isConfigured()) {
      await mem0Service.clearAllDemoUserMemories(userId).catch(() => {});
    }

    // 2. Clear database records scoped to this demo user
    await prisma.$transaction([
      prisma.priceWatch.deleteMany({ where: { demoUserId: userId } }),
      prisma.order.deleteMany({ where: { demoUserId: userId } }),
      prisma.financialTransaction.deleteMany({ where: { demoUserId: userId } }),
      prisma.conversation.deleteMany({ where: { demoUserId: userId } }),
      prisma.financialProfile.deleteMany({ where: { demoUserId: userId } }),
      prisma.demoSession.deleteMany({ where: { demoUserId: userId } }),
    ]);

    // Clear session cookie
    res.clearCookie('morrow_session_id');

    res.json({
      success: true,
      message: 'Demo session data, transactions, price watches, and personal memory cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/demo/simulate-drop
 * Helper for judges to trigger a price drop event on an active price watch
 */
demoRouter.post('/demo/simulate-drop', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const watch = await prisma.priceWatch.findFirst({
      where: { demoUserId: req.demoUserId, status: 'active' },
      include: { product: true },
    });

    if (!watch) {
      res.status(404).json({ success: false, error: 'No active price watch found for current demo user.' });
      return;
    }

    const dropPrice = Math.max(1, Math.round(watch.targetPrice * 0.95)); // drops below target
    await priceWatchService.processPriceEvent({
      productId: watch.productId,
      newPrice: dropPrice,
      currency: watch.currency,
      merchantDomain: 'Demo Merchant Store',
    });

    res.json({
      success: true,
      message: `Simulated price drop for ${watch.product.title}: dropped to ${watch.currency} ${dropPrice} (target was ${watch.targetPrice}).`,
      newPrice: dropPrice,
    });
  } catch (error) {
    next(error);
  }
});
