import type { Product, SearchFilters } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoData';

function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

export const mockProductService = {
  async search(query: string, filters?: SearchFilters): Promise<Product[]> {
    await delay(350);
    const q = query.toLowerCase().trim();
    let results = DEMO_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.includes(q)) ||
      q.split(' ').some(word => p.title.toLowerCase().includes(word) || p.tags?.some(t => t.includes(word)))
    );
    if (results.length === 0 && !query) results = [...DEMO_PRODUCTS];
    else if (results.length === 0) results = DEMO_PRODUCTS.slice(0, 3); // sensible fallback
    if (filters?.category) results = results.filter(p => p.category === filters.category);
    if (filters?.maxPrice) results = results.filter(p => p.price <= filters.maxPrice!);
    if (filters?.minPrice) results = results.filter(p => p.price >= filters.minPrice!);
    if (filters?.brand) results = results.filter(p => p.brand.toLowerCase().includes(filters.brand!.toLowerCase()));
    if (filters?.merchant) results = results.filter(p => p.merchant.toLowerCase().includes(filters.merchant!.toLowerCase()));
    return results;
  },

  async getById(id: string): Promise<Product | null> {
    await delay(150);
    return DEMO_PRODUCTS.find(p => p.id === id) || null;
  },

  async getRecommendations(tags?: string[]): Promise<Product[]> {
    await delay(200);
    if (tags && tags.length > 0) {
      const scored = DEMO_PRODUCTS.map(p => ({
        product: p,
        score: (p.tags || []).filter(t => tags.includes(t)).length,
      }));
      return scored.sort((a, b) => b.score - a.score).slice(0, 4).map(s => s.product);
    }
    return DEMO_PRODUCTS.slice(0, 4);
  },
};

