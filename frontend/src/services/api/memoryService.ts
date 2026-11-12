import { apiRequest } from './apiClient';
import type { Memory } from '@/types/memory';

export const memoryService = {
  getMemories: async (): Promise<Memory[]> => {
    try {
      const list = await apiRequest<any[]>('/api/memory');
      return list.map((m) => ({
        id: m.id,
        category: (m.categories?.[0] as any) || 'shopping_preference',
        content: m.memory || m.content,
        source: 'explicit',
        confidence: 1,
        createdAt: m.created_at || new Date().toISOString(),
        updatedAt: m.updated_at || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  },

  addMemory: async (content: string, category = 'shopping_preference') => {
    return apiRequest('/api/memory', {
      method: 'POST',
      body: JSON.stringify({ content, category }),
    });
  },

  updateMemory: async (id: string, content: string) => {
    return apiRequest(`/api/memory/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  },

  deleteMemory: async (id: string) => {
    return apiRequest(`/api/memory/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  clearAllMemories: async () => {
    return apiRequest('/api/memory', {
      method: 'DELETE',
    });
  },
};
