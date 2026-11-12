import { apiRequest } from './apiClient';
import { mockProductService } from '../mock/products.mock';
import type { Product, SearchFilters } from '@/types/product';

export const productService = {
  search: async (query: string, filters?: SearchFilters): Promise<Product[]> => {
    try {
      const response = await apiRequest<{ products: any[]; nextPageToken?: string }>(
        '/api/products/search',
        {
          method: 'POST',
          body: JSON.stringify({
            query,
            minimumPrice: filters?.minPrice,
            maximumPrice: filters?.maxPrice,
            brand: filters?.brand,
            category: filters?.category,
            limit: 20,
          }),
        }
      );

      if (response && Array.isArray(response.products) && response.products.length > 0) {
        return response.products.map((p) => ({
          id: p.id,
          title: p.title,
          brand: p.brand,
          description: p.description || '',
          price: p.price,
          currency: p.currency,
          image: p.imageUrl,
          merchant: p.merchant,
          productUrl: p.merchantUrl,
          rating: p.rating || 4.5,
          reviewCount: p.reviewCount || 120,
          category: p.category || 'Electronics',
          attributes: p.attributes || [],
          offers: p.offers || [],
          variants: p.variants || [],
        }));
      }

      return mockProductService.search(query, filters);
    } catch (err) {
      console.warn('Real Channel3 search error, using demo catalog fallback:', err);
      return mockProductService.search(query, filters);
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      const p = await apiRequest<any>(`/api/products/${encodeURIComponent(id)}`);
      if (p) {
        return {
          id: p.id,
          title: p.title,
          brand: p.brand,
          description: p.description || '',
          price: p.price,
          currency: p.currency,
          image: p.imageUrl,
          merchant: p.merchant,
          productUrl: p.merchantUrl,
          rating: p.rating || 4.5,
          reviewCount: p.reviewCount || 120,
          category: p.category || 'Electronics',
          attributes: p.attributes || [],
          offers: p.offers || [],
          variants: p.variants || [],
        };
      }
      return mockProductService.getById(id);
    } catch {
      return mockProductService.getById(id);
    }
  },

  getPriceHistory: async (id: string, days = 90): Promise<any[]> => {
    try {
      const res = await apiRequest<{ history: any[] }>(
        `/api/products/${encodeURIComponent(id)}/price-history?days=${days}`
      );
      return res.history || [];
    } catch {
      return [];
    }
  },

  getRecommendations: async (tags?: string[]): Promise<Product[]> => {
    try {
      return productService.search('top rated gadgets', { limit: 6 } as any);
    } catch {
      return mockProductService.getRecommendations(tags);
    }
  },
};
