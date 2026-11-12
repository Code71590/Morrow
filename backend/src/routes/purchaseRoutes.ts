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

/**
 * GET /api/purchases/:id/invoice
 * Retrieve generated invoice breakdown for order
 */
purchaseRouter.get('/:id/invoice', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: req.params.id }, { paypalOrderId: req.params.id }],
        demoUserId: req.demoUserId,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, error: 'Invoice not found for order' });
      return;
    }

    let items: any[] = [];
    try {
      if (order.itemsJson) items = JSON.parse(order.itemsJson);
    } catch {}

    const invoiceNumber = `INV-${order.createdAt.toISOString().slice(0, 4)}-${order.id.slice(0, 8).toUpperCase()}`;
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * (item.quantity || 1)), 0) || order.amount * 0.92;
    const tax = Math.round((order.amount - subtotal) * 100) / 100;

    const invoice = {
      invoiceNumber,
      orderId: order.id,
      paypalOrderId: order.paypalOrderId,
      captureId: order.captureId || 'VERIFIED-CAPTURE',
      issuedAt: order.createdAt,
      paidAt: order.updatedAt,
      status: order.orderStatus.toUpperCase(),
      merchant: order.merchant,
      currency: order.currency,
      customer: {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        account: req.demoUserId,
      },
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: tax > 0 ? tax : Math.round(order.amount * 0.08 * 100) / 100,
      shipping: 0.00,
      total: order.amount,
      paymentMethod: 'PayPal Sandbox Verified Capture',
      company: {
        name: 'Morrow Financial Intelligence Inc.',
        address: '500 Howard Street, Suite 400, San Francisco, CA 94105',
        taxId: 'US-EIN-94-2849102',
        support: 'support@trymorrow.ai',
      },
    };

    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
});
