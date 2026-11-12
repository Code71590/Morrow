import { useState, useCallback } from 'react';
import type { Product, SearchFilters } from '@/types/product';
import { productService } from '@/services/api/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [lastQuery, setLastQuery] = useState('');

  const search = useCallback(async (query: string, filters?: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    setLastQuery(query);
    try {
      const results = await productService.search(query, filters);
      setProducts(results);
    } catch {
      setError('Failed to search products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecommendations = useCallback(async (tags?: string[]) => {
    try {
      const recs = await productService.getRecommendations(tags);
      setRecommendations(recs);
    } catch {}
  }, []);

  const clearResults = useCallback(() => {
    setProducts([]);
    setLastQuery('');
    setError(null);
  }, []);

  return { products, isLoading, error, search, recommendations, loadRecommendations, clearResults, lastQuery };
}

