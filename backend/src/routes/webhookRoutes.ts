import { Router, Request, Response, NextFunction } from 'express';
import { Webhook } from 'svix';
import { env } from '../config/env.js';
import prisma from '../config/prisma.js';
import { priceWatchService } from '../services/priceWatchService.js';

export const webhookRouter = Router();

/**
 * POST /webhooks/channel3
 * Svix-verified Channel3 Product Subscription webhook receiver
 */
webhookRouter.post('/channel3', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const svixId = req.headers['svix-id'] as string;
    const svixTimestamp = req.headers['svix-timestamp'] as string;
    const svixSignature = req.headers['svix-signature'] as string;

    // Verify webhook signature using official Svix library
    if (env.CHANNEL3_WEBHOOK_SECRET && env.CHANNEL3_WEBHOOK_SECRET.trim().length > 0) {
      if (!svixId || !svixTimestamp || !svixSignature) {
        res.status(401).json({ error: 'Missing Svix verification headers' });
        return;
      }

      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      try {
        const wh = new Webhook(env.CHANNEL3_WEBHOOK_SECRET);
        wh.verify(rawBody, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        });
      } catch (err: any) {
        console.error('Svix signature verification failed:', err.message);
        res.status(401).json({ error: 'Invalid webhook signature' });
        return;
      }
    } else {
      console.warn('CHANNEL3_WEBHOOK_SECRET not configured: processing payload in development sandbox mode.');
    }

    const payload = req.body;
    const eventId = svixId || payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || payload.type || payload.event_type || 'offer.price.changed';

    // Event deduplication check
    const existing = await prisma.webhookEvent.findUnique({
      where: { providerEventId: eventId },
    });

    if (existing) {
      // Idempotent duplicate
      res.status(200).json({ status: 'duplicate_ignored' });
      return;
    }

    // Persist event record
    await prisma.webhookEvent.create({
      data: {
        provider: 'channel3',
        providerEventId: eventId,
        eventType,
        payload: JSON.stringify(payload),
      },
    });

    // Acknowledge HTTP success immediately
    res.status(200).json({ status: 'received' });

    // Asynchronously dispatch event to price watch engine
    setImmediate(async () => {
      try {
        const data = payload.data || payload;
        const productId = data.product_id || data.productId;
        const offer = data.offer || data;
        const newPrice = typeof offer.price === 'number' ? offer.price : parseFloat(offer.price || '0');
        const currency = offer.currency || 'USD';
        const merchantDomain = offer.domain || offer.merchant_domain || 'merchant.com';
        const merchantUrl = offer.url || offer.merchant_url;

        if (productId && newPrice > 0) {
          await priceWatchService.processPriceEvent({
            productId,
            newPrice,
            currency,
            merchantDomain,
            merchantUrl,
          });
        }
      } catch (procErr) {
        console.error('Error processing price watch webhook event:', procErr);
      }
    });
  } catch (error) {
    next(error);
  }
});
