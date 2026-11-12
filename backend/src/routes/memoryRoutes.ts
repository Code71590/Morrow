import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { mem0Service } from '../services/mem0Service.js';

export const memoryRouter = Router();

const searchMemorySchema = z.object({
  query: z.string().default('preferences'),
  limit: z.number().optional().default(20),
});

const addMemorySchema = z.object({
  content: z.string().min(1, 'Memory content required'),
  category: z.string().optional().default('shopping_preference'),
});

const updateMemorySchema = z.object({
  content: z.string().min(1, 'Updated content required'),
});

/**
 * GET /api/memory
 * List all memories for current demo session
 */
memoryRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await mem0Service.getAllUserMemories(req.demoUserId);
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/memory/search
 * Search long-term memories
 */
memoryRouter.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, limit } = searchMemorySchema.parse(req.body);
    const results = await mem0Service.searchMemories(query, req.demoUserId, limit);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/memory
 * Explicitly save user memory
 */
memoryRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = addMemorySchema.parse(req.body);
    const result = await mem0Service.addMemory(
      [{ role: 'user', content }],
      req.demoUserId
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/memory/:id
 * Edit memory
 */
memoryRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = updateMemorySchema.parse(req.body);
    const success = await mem0Service.updateMemory(req.params.id, content);
    res.json({ success });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/memory/:id
 * Delete specific memory
 */
memoryRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await mem0Service.deleteMemory(req.params.id);
    res.json({ success });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/memory
 * Clear all demo memories for this user
 */
memoryRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await mem0Service.clearAllDemoUserMemories(req.demoUserId);
    res.json({ success });
  } catch (error) {
    next(error);
  }
});
