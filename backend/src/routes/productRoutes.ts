import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { channel3Service } from '../services/channel3Service.js';
import prisma from '../config/prisma.js';

export const productRouter = Router();

const searchSchema = z.object({
  query: z.string().default(''),
  minimumPrice: z.number().optional(),
  maximumPrice: z.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  limit: z.number().optional().default(20),
  nextPageToken: z.string().optional(),
});

const lookupSchema = z.object({
  url: z.string().url('Invalid merchant URL'),
});

/**
 * POST /api/products/search
 * Real product search via Channel3
 */
productRouter.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = searchSchema.parse(req.body);
    const result = await channel3Service.searchProducts(
      input.query,
      {
        minimumPrice: input.minimumPrice,
        maximumPrice: input.maximumPrice,
        brand: input.brand,
        category: input.category,
        limit: input.limit,
        nextPageToken: input.nextPageToken,
      },
      req.demoUserId
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/products/lookup
 * External retailer URL lookup via Channel3
 */
productRouter.post('/lookup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = lookupSchema.parse(req.body);
    const product = await channel3Service.lookupProductUrl(input.url, req.demoUserId);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id
 * Retrieve verified product details and merchant offers
 */
productRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;

    // Check if Channel3 is configured
    if (channel3Service.isConfigured()) {
      try {
        const product = await channel3Service.getProductDetails(productId, req.demoUserId);
        res.json({ success: true, data: product });
        return;
      } catch (e) {
        console.warn(`Channel3 getProductDetails error for ${productId}:`, e);
      }
    }

    // Fallback to local DB cached product if API call fails or offline
    const cached = await prisma.product.findFirst({
      where: {
        OR: [{ id: productId }, { channel3ProductId: productId }],
      },
      include: {
        offers: true,
        priceObservations: {
          orderBy: { observedAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!cached) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    let meta: any = {};
    try {
      if (cached.metadata) meta = JSON.parse(cached.metadata);
    } catch {}

    res.json({
      success: true,
      data: {
        id: cached.channel3ProductId,
        title: cached.title,
        brand: cached.brand,
        description: cached.description || '',
        imageUrl: cached.imageUrl,
        price: cached.offers[0]?.price || 0,
        currency: cached.sourceCurrency,
        merchant: cached.offers[0]?.merchantDomain || 'Merchant',
        merchantUrl: cached.offers[0]?.merchantUrl || '',
        availability: cached.offers[0]?.availability || 'InStock',
        rating: meta.rating,
        reviewCount: meta.reviewCount,
        category: cached.category,
        attributes: meta.attributes || [],
        offers: cached.offers.map((o) => ({
          merchantName: o.merchantDomain,
          merchantDomain: o.merchantDomain,
          merchantUrl: o.merchantUrl,
          price: o.price,
          currency: o.currency,
          availability: o.availability,
        })),
        variants: meta.variants || [],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id/price-history
 * Real 90-day price history observations from Channel3
 */
productRouter.get('/:id/price-history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const days = parseInt(req.query.days as string, 10) || 90;

    let history: any[] = [];
    if (channel3Service.isConfigured()) {
      try {
        history = await channel3Service.getPriceHistory(productId, days, req.demoUserId);
      } catch (err) {
        console.warn('Channel3 price history error:', err);
      }
    }

    // If API returned empty, retrieve from internal observations
    if (!history || history.length === 0) {
      const dbObs = await prisma.priceObservation.findMany({
        where: {
          product: {
            OR: [{ id: productId }, { channel3ProductId: productId }],
          },
        },
        orderBy: { observedAt: 'desc' },
        take: 30,
      });
      history = dbObs.map((obs) => ({
        price: obs.price,
        currency: obs.currency,
        merchant: obs.merchantDomain,
        observed_at: obs.observedAt.toISOString(),
      }));
    }

    res.json({ success: true, data: { history } });
  } catch (error) {
    next(error);
  }
});
