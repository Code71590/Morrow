import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { priceWatchService } from '../services/priceWatchService.js';
import prisma from '../config/prisma.js';

export const priceWatchRouter = Router();

const createWatchSchema = z.object({
  productId: z.string(),
  targetPrice: z.number().positive('Target price must be positive'),
  maximumTotalPrice: z.number().optional(),
  currency: z.string().optional(),
  purchaseMode: z.enum(['notify', 'auto_purchase']).optional().default('notify'),
  merchantDomains: z.array(z.string()).optional(),
  variantSelection: z.any().optional(),
  affordabilityRequired: z.boolean().optional().default(true),
});

const patchWatchSchema = z.object({
  targetPrice: z.number().positive().optional(),
  maximumTotalPrice: z.number().optional(),
  purchaseMode: z.enum(['notify', 'auto_purchase']).optional(),
  status: z.enum(['active', 'paused', 'cancelled']).optional(),
});

/**
 * POST /api/price-watches
 * Create new active price watch and register Channel3 Product Subscription
 */
priceWatchRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createWatchSchema.parse(req.body);
    const watch = await priceWatchService.createPriceWatch(input, req.demoUserId);
    res.status(201).json({ success: true, data: watch });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/price-watches
 * List all watches for demo user
 */
priceWatchRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const watches = await priceWatchService.listPriceWatches(req.demoUserId);
    res.json({ success: true, data: watches });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/price-watches/:id
 * Retrieve watch with historical observations
 */
priceWatchRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const watch = await priceWatchService.getPriceWatchById(req.params.id, req.demoUserId);
    if (!watch) {
      res.status(404).json({ success: false, error: 'Price watch not found' });
      return;
    }
    res.json({ success: true, data: watch });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/price-watches/:id
 * Update threshold or purchase mode
 */
priceWatchRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = patchWatchSchema.parse(req.body);
    const updated = await prisma.priceWatch.updateMany({
      where: { id: req.params.id, demoUserId: req.demoUserId },
      data: updates,
    });
    res.json({ success: true, updatedCount: updated.count });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/price-watches/:id
 * Cancel and delete price watch
 */
priceWatchRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await priceWatchService.deletePriceWatch(req.params.id, req.demoUserId);
    res.json({ success: true, message: 'Price watch deleted' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/price-watches/:id/pause
 */
priceWatchRouter.post('/:id/pause', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await priceWatchService.pausePriceWatch(req.params.id, req.demoUserId);
    res.json({ success: true, status: 'paused' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/price-watches/:id/resume
 */
priceWatchRouter.post('/:id/resume', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await priceWatchService.resumePriceWatch(req.params.id, req.demoUserId);
    res.json({ success: true, status: 'active' });
  } catch (error) {
    next(error);
  }
});
