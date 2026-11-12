import { env } from '../config/env.js';

export interface Mem0MemoryItem {
  id: string;
  memory: string;
  user_id: string;
  categories?: string[];
  created_at?: string;
  updated_at?: string;
  score?: number;
}

export class Mem0Service {
  private baseUrl = 'https://api.mem0.ai';

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Token ${env.MEM0_API_KEY}`,
    };
  }

  public isConfigured(): boolean {
    return Boolean(env.MEM0_API_KEY && env.MEM0_API_KEY.trim().length > 0);
  }

  /**
   * Search user memories via POST /v1/memories/search/
   */
  public async searchMemories(query: string, userId: string, limit = 10): Promise<Mem0MemoryItem[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/memories/search/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query: query || 'shopping brand preferences and budget',
          user_id: userId,
          limit,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.warn(`Mem0 search returned ${response.status}:`, err);
        return [];
      }

      const data: any = await response.json();
      const list = Array.isArray(data) ? data : (data.results || data.memories || []);
      return list.map((item: any) => ({
        id: item.id || item.memory_id,
        memory: item.memory || item.text || item.content || '',
        user_id: item.user_id || userId,
        categories: item.categories || [],
        created_at: item.created_at,
        updated_at: item.updated_at,
        score: item.score,
      }));
    } catch (error) {
      console.warn('Mem0 search request failed (graceful fallback):', error);
      return [];
    }
  }

  /**
   * Add new conversation messages to Mem0: POST /v1/memories/
   */
  public async addMemory(
    messages: Array<{ role: string; content: string }>,
    userId: string
  ): Promise<{ eventId?: string; status?: string }> {
    if (!this.isConfigured()) {
      return { status: 'unconfigured' };
    }

    // Filter out potential sensitive data
    const safeMessages = messages.map((m) => ({
      role: m.role,
      content: m.content.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[REDACTED_CARD]'),
    }));

    try {
      const response = await fetch(`${this.baseUrl}/v1/memories/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          messages: safeMessages,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.warn(`Mem0 add memory failed (${response.status}):`, err);
        return { status: 'failed' };
      }

      const data: any = await response.json();
      const first = Array.isArray(data) ? data[0] : data;
      return {
        eventId: first?.event_id || first?.id || data.event_id || data.id,
        status: first?.status || data.status || 'PENDING',
      };
    } catch (error) {
      console.warn('Mem0 add memory error (graceful fallback):', error);
      return { status: 'error' };
    }
  }

  /**
   * Check status of async memory processing: GET /v1/event/{event_id}/
   */
  public async getEventStatus(eventId: string): Promise<string> {
    if (!this.isConfigured() || !eventId) {
      return 'UNKNOWN';
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/event/${eventId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) return 'UNKNOWN';
      const data: any = await response.json();
      return data.status || 'UNKNOWN';
    } catch {
      return 'UNKNOWN';
    }
  }

  /**
   * List all stored memories for a demo user: GET /v1/memories/?user_id={userId}
   */
  public async getAllUserMemories(userId: string): Promise<Mem0MemoryItem[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/memories/?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // Fallback to broad search if listing is unsupported
        return this.searchMemories('shopping preferences', userId, 30);
      }

      const data: any = await response.json();
      const list = Array.isArray(data) ? data : (data.results || data.memories || []);
      return list.map((item: any) => ({
        id: item.id || item.memory_id,
        memory: item.memory || item.text || item.content || '',
        user_id: item.user_id || userId,
        categories: item.categories || [],
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (err) {
      console.warn('Failed to retrieve user memories:', err);
      return [];
    }
  }

  /**
   * Update a specific memory: PUT /v1/memories/{memory_id}/
   */
  public async updateMemory(memoryId: string, content: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(`${this.baseUrl}/v1/memories/${encodeURIComponent(memoryId)}/`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ text: content }),
      });
      return response.ok;
    } catch (err) {
      console.error('Mem0 updateMemory error:', err);
      return false;
    }
  }

  /**
   * Delete a specific memory: DELETE /v1/memories/{memory_id}/
   */
  public async deleteMemory(memoryId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(`${this.baseUrl}/v1/memories/${encodeURIComponent(memoryId)}/`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch (err) {
      console.error('Mem0 deleteMemory error:', err);
      return false;
    }
  }

  /**
   * Clear all memories for a demo user: DELETE /v1/memories/?user_id={userId}
   */
  public async clearAllDemoUserMemories(userId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(`${this.baseUrl}/v1/memories/?user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch (err) {
      console.error('Mem0 clearAllDemoUserMemories error:', err);
      return false;
    }
  }
}

export const mem0Service = new Mem0Service();
