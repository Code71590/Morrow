import prisma from '../config/prisma.js';
import { channel3Service } from './channel3Service.js';
import { financialDecisionService } from './financialDecisionService.js';

export interface CreatePriceWatchInput {
  productId: string;
  targetPrice: number;
  maximumTotalPrice?: number;
  currency?: string;
  purchaseMode?: 'notify' | 'auto_purchase';
  merchantDomains?: string[];
  variantSelection?: any;
  affordabilityRequired?: boolean;
}

export class PriceWatchService {
  /**
   * Create a persistent price watch and register Channel3 Product Subscription if configured
   */
  public async createPriceWatch(input: CreatePriceWatchInput, demoUserId: string) {
    // 1. Locate product
    let product = await prisma.product.findFirst({
      where: {
        OR: [{ id: input.productId }, { channel3ProductId: input.productId }],
      },
      include: { offers: true },
    });

    if (!product) {
      // Attempt to load from Channel3 if configured
      if (channel3Service.isConfigured()) {
        try {
          await channel3Service.getProductDetails(input.productId, demoUserId);
          product = await prisma.product.findFirst({
            where: {
              OR: [{ id: input.productId }, { channel3ProductId: input.productId }],
            },
            include: { offers: true },
          });
        } catch (e) {
          console.warn('Could not auto-fetch product for price watch:', e);
        }
      }
    }

    if (!product) {
      throw new Error(`Product ${input.productId} could not be found.`);
    }

    // 2. Register Channel3 subscription if API is active
    let channel3SubscriptionId: string | undefined;
    if (channel3Service.isConfigured()) {
      try {
        const sub = await channel3Service.createSubscription(
          {
            productId: product.channel3ProductId,
            domains: input.merchantDomains,
            selection: input.variantSelection,
          },
          demoUserId
        );
        channel3SubscriptionId = sub.subscriptionId;
      } catch (err) {
        console.warn('Channel3 webhook subscription could not be registered (continuing locally):', err);
      }
    }

    // 3. Save PriceWatch record
    const watch = await prisma.priceWatch.create({
      data: {
        demoUserId,
        productId: product.id,
        targetPrice: input.targetPrice,
        maximumTotalPrice: input.maximumTotalPrice,
        currency: input.currency || product.sourceCurrency || 'USD',
        purchaseMode: input.purchaseMode || 'notify',
        merchantDomains: input.merchantDomains ? JSON.stringify(input.merchantDomains) : null,
        variantSelection: input.variantSelection ? JSON.stringify(input.variantSelection) : null,
        affordabilityRequired: input.affordabilityRequired !== undefined ? input.affordabilityRequired : true,
        channel3SubscriptionId,
        status: 'active',
      },
      include: {
        product: {
          include: { offers: true },
        },
      },
    });

    return watch;
  }

  /**
   * List all price watches for a demo user
   */
  public async listPriceWatches(demoUserId: string) {
    return prisma.priceWatch.findMany({
      where: { demoUserId },
      include: {
        product: {
          include: {
            offers: true,
            priceObservations: {
              orderBy: { observedAt: 'desc' },
              take: 20,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get price watch by ID
   */
  public async getPriceWatchById(id: string, demoUserId: string) {
    return prisma.priceWatch.findFirst({
      where: { id, demoUserId },
      include: {
        product: {
          include: {
            offers: true,
            priceObservations: {
              orderBy: { observedAt: 'desc' },
              take: 30,
            },
          },
        },
      },
    });
  }

  /**
   * Pause watch
   */
  public async pausePriceWatch(id: string, demoUserId: string) {
    return prisma.priceWatch.updateMany({
      where: { id, demoUserId },
      data: { status: 'paused' },
    });
  }

  /**
   * Resume watch
   */
  public async resumePriceWatch(id: string, demoUserId: string) {
    return prisma.priceWatch.updateMany({
      where: { id, demoUserId },
      data: { status: 'active' },
    });
  }

  /**
   * Cancel / delete price watch
   */
  public async deletePriceWatch(id: string, demoUserId: string) {
    return prisma.priceWatch.deleteMany({
      where: { id, demoUserId },
    });
  }

  /**
   * Process price observation event (from Channel3 webhook or test trigger)
   */
  public async processPriceEvent(event: {
    productId: string;
    newPrice: number;
    currency: string;
    merchantDomain: string;
    merchantUrl?: string;
  }) {
    // 1. Find product
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: event.productId }, { channel3ProductId: event.productId }],
      },
    });

    if (!product) return;

    // 2. Record observation
    await prisma.priceObservation.create({
      data: {
        productId: product.id,
        merchantDomain: event.merchantDomain,
        price: event.newPrice,
        currency: event.currency,
      },
    });

    // 3. Update or create offer
    await prisma.productOffer.upsert({
      where: {
        id: `${product.id}_${event.merchantDomain}`,
      },
      update: {
        price: event.newPrice,
        currency: event.currency,
        observedAt: new Date(),
      },
      create: {
        id: `${product.id}_${event.merchantDomain}`,
        productId: product.id,
        merchantDomain: event.merchantDomain,
        merchantUrl: event.merchantUrl || '',
        price: event.newPrice,
        currency: event.currency,
        availability: 'InStock',
        observedAt: new Date(),
      },
    });

    // 4. Find all matching active watches
    const watches = await prisma.priceWatch.findMany({
      where: {
        productId: product.id,
        status: 'active',
      },
    });

    for (const watch of watches) {
      if (event.newPrice <= watch.targetPrice) {
        // Price condition reached!
        let canTrigger = true;

        if (watch.affordabilityRequired) {
          const profile = await prisma.financialProfile.findUnique({
            where: { demoUserId: watch.demoUserId },
          });
          if (profile) {
            const evalResult = financialDecisionService.evaluatePurchase(
              profile,
              event.newPrice,
              event.currency
            );
            if (evalResult.decision === 'NOT_RECOMMENDED') {
              canTrigger = false;
            }
          }
        }

        if (canTrigger) {
          await prisma.priceWatch.update({
            where: { id: watch.id },
            data: {
              status: 'triggered',
              lastCheckedAt: new Date(),
            },
          });
        }
      }
    }
  }
}

export const priceWatchService = new PriceWatchService();
