import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { geminiService } from '../services/geminiService.js';
import prisma from '../config/prisma.js';

export const assistantRouter = Router();

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversationId: z.string().optional(),
});

/**
 * POST /api/assistant/chat
 * Main conversational assistant turn with tool execution
 */
assistantRouter.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, conversationId } = chatSchema.parse(req.body);
    const result = await geminiService.chat({
      message,
      conversationId,
      demoUserId: req.demoUserId,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assistant/conversations
 * List conversations for current demo user
 */
assistantRouter.get('/conversations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await prisma.conversation.findMany({
      where: { demoUserId: req.demoUserId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assistant/conversations/:id
 * Retrieve single conversation with all messages
 */
assistantRouter.get('/conversations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.id,
        demoUserId: req.demoUserId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      res.status(404).json({ success: false, error: 'Conversation not found' });
      return;
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
});
