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
   * Helper to safely extract numeric price and currency from flexible Channel3 price payloads
   */
  private extractPrice(priceObj: any, defaultCurrency = 'USD'): { price: number; currency: string } {
    if (typeof priceObj === 'number') {
      return { price: isNaN(priceObj) ? 0 : priceObj, currency: defaultCurrency };
    }
    if (priceObj && typeof priceObj === 'object') {
      const val = typeof priceObj.price === 'number'
        ? priceObj.price
        : parseFloat(priceObj.price || priceObj.amount || priceObj.value || '0');
      const cur = priceObj.currency || priceObj.currency_code || defaultCurrency;
      return { price: isNaN(val) ? 0 : val, currency: cur };
    }
    if (typeof priceObj === 'string') {
      const val = parseFloat(priceObj.replace(/[^0-9.-]+/g, ''));
      return { price: isNaN(val) ? 0 : val, currency: defaultCurrency };
    }
    return { price: 0, currency: defaultCurrency };
  }

  /**
   * Normalizes Channel3 product structure and persists to database
   */
  public async normalizeAndPersistProduct(raw: any): Promise<Channel3ProductSummary> {
    const rawOffers = Array.isArray(raw.offers) ? raw.offers : (raw.best_offer ? [raw.best_offer] : []);

    // Brand extraction (handles string or array of brand objects)
    let brand = 'Brand';
    if (raw.brand && typeof raw.brand === 'string') {
      brand = raw.brand;
    } else if (raw.brand_name && typeof raw.brand_name === 'string') {
      brand = raw.brand_name;
    } else if (Array.isArray(raw.brands) && raw.brands.length > 0) {
      brand = typeof raw.brands[0] === 'string'
        ? raw.brands[0]
        : (raw.brands[0]?.name || raw.brands[0]?.title || 'Brand');
    }

    // Image URL extraction (handles string or array of image objects with url/cleaned_url)
    let imageUrl = '';
    if (typeof raw.imageUrl === 'string' && raw.imageUrl) {
      imageUrl = raw.imageUrl;
    } else if (typeof raw.image === 'string' && raw.image) {
      imageUrl = raw.image;
    } else if (Array.isArray(raw.images) && raw.images.length > 0) {
      const firstImg = raw.images[0];
      imageUrl = typeof firstImg === 'string'
        ? firstImg
        : (firstImg?.url || firstImg?.cleaned_url || '');
    } else if (raw.image && typeof raw.image === 'object') {
      imageUrl = raw.image.url || raw.image.cleaned_url || '';
    }

    // Category extraction (handles string or category object)
    let category = 'Electronics';
    if (typeof raw.category === 'string' && raw.category) {
      category = raw.category;
    } else if (raw.category && typeof raw.category === 'object') {
      category = raw.category.title || raw.category.slug || 'Electronics';
    } else if (Array.isArray(raw.categories) && raw.categories.length > 0) {
      category = typeof raw.categories[0] === 'string'
        ? raw.categories[0]
        : (raw.categories[0]?.title || 'Electronics');
    }

    const normalizedOffers: Channel3Offer[] = rawOffers.map((o: any) => {
      const pData = this.extractPrice(o.price, env.CHANNEL3_CURRENCY);
      let merchantDomain = o.domain || o.merchant_domain || 'merchant.com';
      if ((!merchantDomain || merchantDomain === 'merchant.com') && o.url) {
        try {
          merchantDomain = new URL(o.url).hostname;
        } catch {}
      }
      return {
        merchantName: o.merchant_name || o.domain || brand || 'Retail Merchant',
        merchantDomain,
        merchantUrl: o.url || o.merchant_url || '',
        price: pData.price,
        currency: pData.currency,
        availability: o.availability || 'InStock',
        observedAt: o.observed_at || new Date().toISOString(),
      };
    });

    const bestOffer = normalizedOffers[0] || {};
    const rawPriceData = this.extractPrice(raw.price, env.CHANNEL3_CURRENCY);
    const price = bestOffer.price > 0 ? bestOffer.price : rawPriceData.price;
    const currency = bestOffer.currency || rawPriceData.currency || env.CHANNEL3_CURRENCY;
    const merchant = bestOffer.merchantName || raw.merchant || 'Retail Merchant';
    const merchantUrl = bestOffer.merchantUrl || raw.url || raw.merchant_url || '';
    const availability = bestOffer.availability || raw.availability || 'InStock';

    const productId = raw.id || raw.product_id || raw.canonical_product_id || `c3_${Date.now()}`;
    const title = raw.title || raw.name || 'Product';
    const description = typeof raw.description === 'string' ? raw.description : '';
    const rating = typeof raw.rating === 'number' ? raw.rating : (raw.average_rating || 4.5);
    const reviewCount = typeof raw.review_count === 'number' ? raw.review_count : (raw.reviews_count || 120);

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
            price,
            attributes: raw.attributes || raw.structured_attributes || [],
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
            price,
            attributes: raw.attributes || raw.structured_attributes || [],
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
      attributes: raw.attributes || raw.structured_attributes || [],
      offers: normalizedOffers,
      variants: raw.variants || [],
    };
  }
}

export const channel3Service = new Channel3Service();
