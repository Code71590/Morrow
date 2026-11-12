export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  available?: boolean;
}

export interface ProductOffer {
  id: string;
  merchant: string;
  price: number;
  currency: string;
  productUrl: string;
  availability?: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown';
  shippingCost?: number;
  rating?: number;
  reviewCount?: number;
}

export interface Product {
  id: string;
  externalId?: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  price: number;
  currency: string;
  merchant: string;
  productUrl?: string;
  rating?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  offers?: ProductOffer[];
  tags?: string[];
  isMock?: boolean;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  merchant?: string;
  currency?: string;
}

export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
  filters?: SearchFilters;
}
