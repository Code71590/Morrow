import { env } from '../config/env.js';
import prisma from '../config/prisma.js';

export interface Channel3ProductSummary {
  id: string;
  title: string;
  brand: string;
  description?: string;
  imageUrl: string;
  price: number;
  currency: string;
  merchant: string;
  merchantUrl: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  attributes?: Array<{ name: string; value: string }>;
  offers?: Channel3Offer[];
  variants?: any[];
}

export interface Channel3Offer {
  id?: string;
  merchantName: string;
  merchantDomain: string;
  merchantUrl: string;
  price: number;
  currency: string;
  availability: string;
  observedAt?: string;
}

export interface Channel3SearchFilters {
  minimumPrice?: number;
  maximumPrice?: number;
  brand?: string;
  category?: string;
  limit?: number;
  nextPageToken?: string;
}

export interface Channel3SubscriptionPayload {
  productId: string;
  events?: string[];
  domains?: string[];
  selection?: Array<{ name: string; label: string }>;
}

export class Channel3Service {
  private baseUrl = 'https://api.trychannel3.com';

  private getHeaders(userId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': env.CHANNEL3_API_KEY,
    };
    if (userId) {
      headers['x-user-id'] = userId;
    }
    return headers;
  }

  public isConfigured(): boolean {
    return Boolean(env.CHANNEL3_API_KEY && env.CHANNEL3_API_KEY.trim().length > 0);
  }

  /**
   * Search real products using Channel3 POST /v1/search
   */
  public async searchProducts(
    query: string,
    filters?: Channel3SearchFilters,
    userId?: string
  ): Promise<{ products: Channel3ProductSummary[]; nextPageToken?: string }> {
    if (!this.isConfigured()) {
      throw new Error('Channel3 API key is not configured. Please set CHANNEL3_API_KEY in .env.');
    }

    const payload: any = {
      query: query || 'popular products',
      limit: filters?.limit || 20,
    };

    if (filters?.nextPageToken) {
      payload.page_token = filters.nextPageToken;
    }

    const priceFilter: any = {};
    if (filters?.minimumPrice !== undefined) priceFilter.min_price = filters.minimumPrice;
    if (filters?.maximumPrice !== undefined) priceFilter.max_price = filters.maximumPrice;

    if (Object.keys(priceFilter).length > 0 || filters?.brand) {
      payload.filters = {};
      if (Object.keys(priceFilter).length > 0) payload.filters.price = priceFilter;
      if (filters?.brand) payload.filters.brands = [filters.brand];
    }

    const response = await fetch(`${this.baseUrl}/v1/search`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`Channel3 search failed (${response.status}):`, errBody);
      throw new Error(`Channel3 search failed with HTTP ${response.status}: ${errBody}`);
    }

    const data: any = await response.json();
    const rawItems = data.products || data.items || data.results || [];
    const normalized = await Promise.all(
      rawItems.map((item: any) => this.normalizeAndPersistProduct(item))
    );

    return {
      products: normalized,
      nextPageToken: data.next_page_token,
    };
  }

  /**
   * Product details from Channel3 GET /v1/products/{product_id}
   */
  public async getProductDetails(productId: string, userId?: string): Promise<Channel3ProductSummary> {
    if (!this.isConfigured()) {
      throw new Error('Channel3 API key is not configured. Please set CHANNEL3_API_KEY in .env.');
    }

    const response = await fetch(`${this.baseUrl}/v1/products/${encodeURIComponent(productId)}`, {
      method: 'GET',
      headers: this.getHeaders(userId),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Channel3 product details failed with HTTP ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    return this.normalizeAndPersistProduct(data);
  }

  /**
   * Product lookup by merchant URL: POST /v1/lookup
   */
  public async lookupProductUrl(url: string, userId?: string): Promise<Channel3ProductSummary> {
    if (!this.isConfigured()) {
      throw new Error('Channel3 API key is not configured. Please set CHANNEL3_API_KEY in .env.');
    }

    const response = await fetch(`${this.baseUrl}/v1/lookup`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Channel3 lookup failed with HTTP ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    return this.normalizeAndPersistProduct(data);
  }

  /**
   * Create Product Subscription for webhooks: POST /v1/product-subscriptions
   */
  public async createSubscription(payload: Channel3SubscriptionPayload, userId?: string): Promise<{ subscriptionId: string }> {
    if (!this.isConfigured()) {
      throw new Error('Channel3 API key is not configured. Please set CHANNEL3_API_KEY in .env.');
    }

    const body: any = {
      product_id: payload.productId,
      events: payload.events || [
        'offer.price.changed',
        'offer.availability.changed',
        'offer.created',
        'offer.deleted',
      ],
    };

    if (payload.domains && payload.domains.length > 0) {
      body.domains = payload.domains;
    }
    if (payload.selection && payload.selection.length > 0) {
      body.selection = payload.selection;
    }

    const response = await fetch(`${this.baseUrl}/v1/product-subscriptions`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Channel3 create subscription failed (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    return {
      subscriptionId: data.subscription_id || data.id,
    };
  }

  /**
   * Retrieve price history: GET /v0/price-tracking/history/{canonical_product_id}?days=90
   */
  public async getPriceHistory(productId: string, days = 90, userId?: string): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('Channel3 API key is not configured. Please set CHANNEL3_API_KEY in .env.');
    }

    const response = await fetch(
      `${this.baseUrl}/v0/price-tracking/history/${encodeURIComponent(productId)}?days=${days}`,
      {
        method: 'GET',
        headers: this.getHeaders(userId),
      }
    );

    if (!response.ok) {
      // Non-fatal: some products may not have 90-day history yet
      console.warn(`Channel3 price history not available for ${productId} (${response.status})`);
      return [];
    }

    const data: any = await response.json();
    return data.history || data.observations || [];
  }

  /**
   * Normalizes Channel3 product structure and persists to database
   */
  public async normalizeAndPersistProduct(raw: any): Promise<Channel3ProductSummary> {
    const rawOffers = raw.offers || (raw.best_offer ? [raw.best_offer] : []);
    const bestOffer = raw.best_offer || rawOffers[0] || {};

    const price = typeof bestOffer.price === 'number'
      ? bestOffer.price
      : (typeof raw.price === 'number' ? raw.price : parseFloat(raw.price || bestOffer.price || '0') || 0);

    const currency = bestOffer.currency || raw.currency || env.CHANNEL3_CURRENCY;
    const merchant = bestOffer.merchant_name || bestOffer.domain || raw.merchant || 'Retail Merchant';
    const merchantUrl = bestOffer.url || bestOffer.merchant_url || raw.url || raw.merchant_url || '';
    const availability = bestOffer.availability || raw.availability || 'InStock';

    const productId = raw.id || raw.product_id || raw.canonical_product_id || `c3_${Date.now()}`;
    const title = raw.title || raw.name || 'Product';
    const brand = raw.brand || raw.brand_name || 'Brand';
    const imageUrl = raw.image_url || raw.image || (Array.isArray(raw.images) && raw.images[0]) || '';
    const description = raw.description || '';
    const rating = raw.rating || raw.average_rating;
    const reviewCount = raw.review_count || raw.reviews_count;
    const category = raw.category || raw.categories?.[0] || 'Electronics';

    const normalizedOffers: Channel3Offer[] = rawOffers.map((o: any) => ({
      merchantName: o.merchant_name || o.domain || merchant,
      merchantDomain: o.domain || o.merchant_domain || (o.url ? new URL(o.url).hostname : 'merchant.com'),
      merchantUrl: o.url || o.merchant_url || merchantUrl,
      price: typeof o.price === 'number' ? o.price : parseFloat(o.price || '0'),
      currency: o.currency || currency,
      availability: o.availability || 'InStock',
      observedAt: o.observed_at || new Date().toISOString(),
    }));

    // Persist into database so relations and internal references stay synchronized
    try {
      await prisma.product.upsert({
        where: { channel3ProductId: productId },
        update: {
          title,
          brand,
          imageUrl,
          description,
          category,
          sourceCurrency: currency,
          metadata: JSON.stringify({
            rating,
            reviewCount,
            attributes: raw.attributes || [],
            variants: raw.variants || [],
          }),
        },
        create: {
          channel3ProductId: productId,
          title,
          brand,
          imageUrl,
          description,
          category,
          sourceCurrency: currency,
          metadata: JSON.stringify({
            rating,
            reviewCount,
            attributes: raw.attributes || [],
            variants: raw.variants || [],
          }),
        },
      });
    } catch (err) {
      console.warn('Failed to cache product in DB (non-fatal):', err);
    }

    return {
      id: productId,
      title,
      brand,
      description,
      imageUrl,
      price,
      currency,
      merchant,
      merchantUrl,
      availability,
      rating,
      reviewCount,
      category,
      attributes: raw.attributes || [],
      offers: normalizedOffers,
      variants: raw.variants || [],
    };
  }
}

export const channel3Service = new Channel3Service();
