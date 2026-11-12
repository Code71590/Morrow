import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

export const purchaseRouter = Router();

/**
 * GET /api/purchases
 * List verified orders
 */
purchaseRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      where: { demoUserId: req.demoUserId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/purchases/:id
 * Retrieve order receipt
 */
purchaseRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        demoUserId: req.demoUserId,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});
