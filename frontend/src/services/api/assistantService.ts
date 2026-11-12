import { apiRequest } from './apiClient';

export interface AssistantChatResult {
  conversationId: string;
  response: string;
  relatedProducts?: any[];
  affordability?: any;
  priceWatch?: any;
}

export const assistantService = {
  chat: async (message: string, conversationId?: string): Promise<AssistantChatResult> => {
    return apiRequest<AssistantChatResult>('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  },

  getConversations: async () => {
    return apiRequest<any[]>('/api/assistant/conversations');
  },

  getConversation: async (id: string) => {
    return apiRequest<any>(`/api/assistant/conversations/${encodeURIComponent(id)}`);
  },

  createConversation: async (title?: string) => {
    return apiRequest<any>('/api/assistant/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  deleteConversation: async (id: string) => {
    return apiRequest<any>(`/api/assistant/conversations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};

