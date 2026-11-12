export type MemoryCategory =
  | 'financial_preference' | 'shopping_preference' | 'product_interest'
  | 'purchase_decision' | 'personal_goal' | 'brand_preference' | 'general';

export type MemorySource = 'explicit' | 'inferred' | 'system';

export interface Memory {
  id: string;
  category: MemoryCategory;
  content: string;
  source: MemorySource;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
