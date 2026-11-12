import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { paypalService } from '../services/paypalService.js';
import { env } from '../config/env.js';

export const paymentRouter = Router();

const createOrderSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().optional().default(1),
  shippingAddress: z.any().optional(),
});

/**
 * GET /api/paypal/config
 * Exposes sandbox client ID and currency to the frontend PayPal SDK (safe public config)
 */
paymentRouter.get('/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      clientId: env.PAYPAL_CLIENT_ID || '',
      currency: env.PAYPAL_CURRENCY,
      env: env.PAYPAL_ENV,
      configured: paypalService.isConfigured(),
    },
  });
});

/**
 * POST /api/paypal/orders
 * Backend calculates price from trusted product record and creates PayPal Sandbox Order
 */
paymentRouter.post('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createOrderSchema.parse(req.body);
    const result = await paypalService.createOrder({
      productId: input.productId,
      demoUserId: req.demoUserId,
      quantity: input.quantity,
      shippingAddress: input.shippingAddress,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/paypal/orders/:orderId/capture
 * Backend captures approved order and verifies capture status
 */
paymentRouter.post('/orders/:orderId/capture', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId;
    const result = await paypalService.captureOrder(orderId, req.demoUserId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/paypal/orders/:orderId
 * Backend retrieves verified PayPal order status
 */
paymentRouter.get('/orders/:orderId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId;
    const details = await paypalService.getOrderDetails(orderId);
    res.json({ success: true, data: details });
  } catch (error) {
    next(error);
  }
});
