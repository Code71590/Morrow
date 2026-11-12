import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import prisma from '../config/prisma.js';
import { channel3Service } from './channel3Service.js';
import { mem0Service } from './mem0Service.js';
import { financialDecisionService } from './financialDecisionService.js';
import { priceWatchService } from './priceWatchService.js';

export interface ChatResponse {
  conversationId: string;
  response: string;
  interactionId?: string;
  relatedProducts?: any[];
  affordability?: any;
  priceWatch?: any;
}

const SYSTEM_INSTRUCTION = `You are Morrow, a personal shopping and financial companion.

Your role is to help users make better purchasing decisions.

You understand:
- Personal shopping preferences.
- Previous conversations.
- Product interests.
- Financial goals.
- Spending patterns.
- Current price watches.
- Previously discussed purchasing decisions.

You should communicate naturally, clearly and empathetically.
You should not behave like a generic chatbot.

You should:
- Remember useful context.
- Avoid asking questions that memory already answers.
- Search real products instead of inventing product suggestions.
- Compare products using actual retrieved information.
- Explain why products suit the user.
- Evaluate financial affordability using the application's calculation engine.
- Recommend waiting when purchasing would conflict with financial goals.
- Offer alternatives when appropriate.
- Avoid unnecessary spending encouragement.
- Be transparent when information is unavailable.

Never invent:
- Product prices.
- Merchant offers.
- Product availability.
- Financial balances.
- Historical prices.
- Payment results.

Never claim an order succeeded unless the backend verifies successful payment capture.
You are not authorized to perform unrestricted financial transactions or execute arbitrary code.`;

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (this.isConfigured()) {
      this.ai = new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY,
      });
    }
  }

  public isConfigured(): boolean {
    return Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);
  }

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      if (!this.isConfigured()) {
        throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in .env.');
      }
      this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }
    return this.ai;
  }

  /**
   * Tool definitions for Function Calling (Interactions & Content generation)
   */
  private getToolDeclarations() {
    return [
      {
        name: 'search_products',
        description: 'Search for real products using Channel3 product discovery engine.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Product search terms (e.g., wireless noise cancelling headphones)' },
            minimum_price: { type: 'NUMBER', description: 'Minimum price filter' },
            maximum_price: { type: 'NUMBER', description: 'Maximum price filter' },
            brand: { type: 'STRING', description: 'Brand name filter (e.g. Sony, Apple, Bose)' },
            category: { type: 'STRING', description: 'Category name filter' },
            limit: { type: 'NUMBER', description: 'Maximum items to retrieve (default 5)' },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_product_details',
        description: 'Get verified Channel3 details, offers, and variants for a product.',
        parameters: {
          type: 'OBJECT',
          properties: {
            product_id: { type: 'STRING', description: 'The unique product ID' },
          },
          required: ['product_id'],
        },
      },
      {
        name: 'lookup_product_url',
        description: 'Look up real product details from an external retailer URL.',
        parameters: {
          type: 'OBJECT',
          properties: {
            url: { type: 'STRING', description: 'Merchant product link' },
          },
          required: ['url'],
        },
      },
      {
        name: 'get_similar_products',
        description: 'Find similar alternative products for comparison.',
        parameters: {
          type: 'OBJECT',
          properties: {
            product_id: { type: 'STRING', description: 'Product ID to find alternatives for' },
          },
          required: ['product_id'],
        },
      },
      {
        name: 'get_product_price_history',
        description: 'Retrieve real historical price observations for a product.',
        parameters: {
          type: 'OBJECT',
          properties: {
            product_id: { type: 'STRING', description: 'Product ID' },
            days: { type: 'NUMBER', description: 'Number of past days (e.g., 30, 90)' },
          },
          required: ['product_id'],
        },
      },
      {
        name: 'get_financial_summary',
        description: "Get user's real-time financial ledger snapshot, available funds, and discretionary runway.",
        parameters: {
          type: 'OBJECT',
          properties: {
            period: { type: 'STRING', description: 'Timeframe (current_month, 3months)' },
          },
        },
      },
      {
        name: 'evaluate_purchase',
        description: "Evaluate affordability of a proposed purchase using the application's deterministic financial engine.",
        parameters: {
          type: 'OBJECT',
          properties: {
            product_id: { type: 'STRING', description: 'Product ID under consideration' },
            proposed_total: { type: 'NUMBER', description: 'Total price of purchase including taxes' },
            currency: { type: 'STRING', description: 'Currency code (e.g. USD, INR)' },
          },
          required: ['proposed_total', 'currency'],
        },
      },
      {
        name: 'get_purchase_history',
        description: 'Get list of past verified purchases and orders.',
        parameters: {
          type: 'OBJECT',
          properties: {
            period: { type: 'STRING', description: 'Optional period' },
            category: { type: 'STRING', description: 'Optional category' },
          },
        },
      },
      {
        name: 'get_spending_insights',
        description: 'Get spending analysis by category and monthly budget pace.',
        parameters: {
          type: 'OBJECT',
          properties: {
            period: { type: 'STRING', description: 'Period' },
          },
        },
      },
      {
        name: 'create_price_watch',
        description: 'Create an active price watch to monitor price drops across merchants.',
        parameters: {
          type: 'OBJECT',
          properties: {
            product_id: { type: 'STRING', description: 'The product ID to track' },
            target_price: { type: 'NUMBER', description: 'Trigger alert price threshold' },
            maximum_total_price: { type: 'NUMBER', description: 'Maximum acceptable total checkout' },
            purchase_mode: { type: 'STRING', description: 'notify or auto_purchase' },
          },
          required: ['product_id', 'target_price'],
        },
      },
      {
        name: 'list_price_watches',
        description: 'List user active price watch alerts.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'pause_price_watch',
        description: 'Pause an active price watch.',
        parameters: {
          type: 'OBJECT',
          properties: {
            watch_id: { type: 'STRING', description: 'Price watch ID' },
          },
          required: ['watch_id'],
        },
      },
      {
        name: 'cancel_price_watch',
        description: 'Cancel and delete a price watch.',
        parameters: {
          type: 'OBJECT',
          properties: {
            watch_id: { type: 'STRING', description: 'Price watch ID' },
          },
          required: ['watch_id'],
        },
      },
      {
        name: 'search_user_memory',
        description: 'Search long-term user preferences, goals, and history in Mem0.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Preference search query' },
            memory_category: { type: 'STRING', description: 'Optional category filter' },
          },
          required: ['query'],
        },
      },
      {
        name: 'save_user_memory',
        description: 'Store a newly discovered user preference or personal boundary into persistent memory.',
        parameters: {
          type: 'OBJECT',
          properties: {
            content: { type: 'STRING', description: 'The durable fact or preference to remember' },
            memory_category: { type: 'STRING', description: 'Category (e.g. shopping_preference, brand_preference, personal_goal)' },
          },
          required: ['content'],
        },
      },
    ];
  }

  /**
   * Execute server-side tool allowlist
   */
  private async executeTool(
    name: string,
    args: any,
    demoUserId: string,
    contextCollector: { relatedProducts: any[]; affordability?: any; priceWatch?: any }
  ): Promise<any> {
    console.log(`[Gemini Tool Execution] ${name}:`, JSON.stringify(args));

    switch (name) {
      case 'search_products': {
        const results = await channel3Service.searchProducts(
          args.query,
          {
            minimumPrice: args.minimum_price,
            maximumPrice: args.maximum_price,
            brand: args.brand,
            category: args.category,
            limit: args.limit || 5,
          },
          demoUserId
        );
        contextCollector.relatedProducts = results.products.slice(0, 4);
        return {
          found_count: results.products.length,
          products: results.products.slice(0, 5).map((p) => ({
            id: p.id,
            title: p.title,
            brand: p.brand,
            price: p.price,
            currency: p.currency,
            merchant: p.merchant,
            merchantUrl: p.merchantUrl,
            in_stock: p.availability === 'InStock',
            rating: p.rating,
          })),
        };
      }

      case 'get_product_details': {
        const product = await channel3Service.getProductDetails(args.product_id, demoUserId);
        contextCollector.relatedProducts = [product];
        return {
          id: product.id,
          title: product.title,
          brand: product.brand,
          description: product.description,
          price: product.price,
          currency: product.currency,
          merchant: product.merchant,
          merchantUrl: product.merchantUrl,
          offers: product.offers?.map((o) => ({
            merchant: o.merchantName,
            price: o.price,
            currency: o.currency,
          })),
        };
      }

      case 'lookup_product_url': {
        const product = await channel3Service.lookupProductUrl(args.url, demoUserId);
        contextCollector.relatedProducts = [product];
        return product;
      }

      case 'get_similar_products': {
        const original = await prisma.product.findFirst({
          where: { OR: [{ id: args.product_id }, { channel3ProductId: args.product_id }] },
        });
        const query = original ? `${original.brand} ${original.category || ''}` : 'alternatives';
        const res = await channel3Service.searchProducts(query, { limit: 4 }, demoUserId);
        return res.products;
      }

      case 'get_product_price_history': {
        const history = await channel3Service.getPriceHistory(args.product_id, args.days || 90, demoUserId);
        return { history };
      }

      case 'get_financial_summary': {
        const profile = await prisma.financialProfile.findUnique({
          where: { demoUserId },
        });
        if (!profile) return { error: 'Profile not found' };
        const discretionary = financialDecisionService.calculateDiscretionaryBudget(profile);
        return {
          currency: profile.currency,
          monthly_income: profile.monthlyIncome,
          available_funds: profile.availableFunds,
          essential_expenses: profile.essentialExpenses,
          savings_commitment: profile.savingsCommitment,
          safety_reserve: profile.safetyReserve,
          discretionary_budget: discretionary,
        };
      }

      case 'evaluate_purchase': {
        const profile = await prisma.financialProfile.findUnique({
          where: { demoUserId },
        });
        if (!profile) return { error: 'Profile not found' };
        const evaluation = financialDecisionService.evaluatePurchase(
          profile,
          args.proposed_total,
          args.currency || profile.currency
        );
        contextCollector.affordability = evaluation;
        return evaluation;
      }

      case 'get_purchase_history': {
        const orders = await prisma.order.findMany({
          where: { demoUserId, orderStatus: 'completed' },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });
        return { orders };
      }

      case 'get_spending_insights': {
        const transactions = await prisma.financialTransaction.findMany({
          where: { demoUserId },
          orderBy: { transactionDate: 'desc' },
          take: 20,
        });
        return { transactions };
      }

      case 'create_price_watch': {
        const watch = await priceWatchService.createPriceWatch(
          {
            productId: args.product_id,
            targetPrice: args.target_price,
            maximumTotalPrice: args.maximum_total_price,
            purchaseMode: args.purchase_mode || 'notify',
          },
          demoUserId
        );
        contextCollector.priceWatch = watch;
        return {
          success: true,
          price_watch_id: watch.id,
          product_title: watch.product.title,
          target_price: watch.targetPrice,
          currency: watch.currency,
          status: watch.status,
        };
      }

      case 'list_price_watches': {
        const watches = await priceWatchService.listPriceWatches(demoUserId);
        return { watches: watches.map((w) => ({ id: w.id, title: w.product.title, target: w.targetPrice, current: w.product.offers[0]?.price })) };
      }

      case 'pause_price_watch': {
        await priceWatchService.pausePriceWatch(args.watch_id, demoUserId);
        return { success: true };
      }

      case 'cancel_price_watch': {
        await priceWatchService.deletePriceWatch(args.watch_id, demoUserId);
        return { success: true };
      }

      case 'search_user_memory': {
        const memories = await mem0Service.searchMemories(args.query, demoUserId);
        return { memories };
      }

      case 'save_user_memory': {
        await mem0Service.addMemory(
          [{ role: 'user', content: args.content }],
          demoUserId
        );
        return { success: true, saved_content: args.content };
      }

      default:
        throw new Error(`Tool "${name}" is not registered in the Morrow execution allowlist.`);
    }
  }

  /**
   * Main conversation turn orchestrator
   */
  public async chat(params: {
    message: string;
    conversationId?: string;
    demoUserId: string;
  }): Promise<ChatResponse> {
    const ai = this.getClient();
    const model = env.GEMINI_MODEL || 'gemini-3.8-flash';

    // 1. Retrieve or create conversation
    let conversation = params.conversationId
      ? await prisma.conversation.findUnique({
          where: { id: params.conversationId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          demoUserId: params.demoUserId,
          title: params.message.slice(0, 40),
        },
        include: { messages: true },
      });
    }

    // 2. Save user message to DB
    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: params.message,
      },
    });

    // 3. Retrieve relevant context: Mem0 persistent memories & financial snapshot
    const relevantMemories = await mem0Service.searchMemories(params.message, params.demoUserId, 5);
    const profile = await prisma.financialProfile.findUnique({
      where: { demoUserId: params.demoUserId },
    });
    const discretionary = profile ? financialDecisionService.calculateDiscretionaryBudget(profile) : 0;

    const memoryContext = relevantMemories.length > 0
      ? `\nRelevant user memories:\n${relevantMemories.map((m) => `- ${m.memory}`).join('\n')}`
      : '';

    const financialContext = profile
      ? `\nCurrent Financial Snapshot: Currency: ${profile.currency}, Discretionary Runway: ${profile.currency} ${discretionary.toLocaleString()}, Monthly Income: ${profile.currency} ${profile.monthlyIncome.toLocaleString()}, Available: ${profile.currency} ${profile.availableFunds.toLocaleString()}`
      : '';

    const systemPromptWithContext = `${SYSTEM_INSTRUCTION}\n${financialContext}${memoryContext}`;

    // 4. Multi-step function calling loop
    const toolDeclarations = this.getToolDeclarations();
    const contextCollector = {
      relatedProducts: [] as any[],
      affordability: undefined as any,
      priceWatch: undefined as any,
    };

    let latestInteractionId = conversation.geminiInteractionId || undefined;
    let finalResponseText = '';

    // We use the Interactions API or models.generateContent with function declaration
    try {
      // Build conversation contents
      const conversationHistory = conversation.messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Add current user prompt
      conversationHistory.push({
        role: 'user',
        parts: [{ text: params.message }],
      });

      // Execute generative function calling with up to 5 loop turns
      let iteration = 0;
      const MAX_TOOL_LOOPS = 5;

      const functionDeclarations = toolDeclarations.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      }));

      while (iteration < MAX_TOOL_LOOPS) {
        iteration++;

        // Call Gemini generateContent / interactions
        const response: any = await (ai as any).models.generateContent({
          model,
          contents: conversationHistory,
          config: {
            systemInstruction: { parts: [{ text: systemPromptWithContext }] },
            tools: [{ functionDeclarations }],
          },
        });

        const candidate = response?.candidates?.[0];
        const contentParts = candidate?.content?.parts || [];

        // Check if function calls are present
        const functionCalls = contentParts.filter((p: any) => Boolean(p.functionCall));

        if (functionCalls.length > 0) {
          // Model returned tool calls
          conversationHistory.push({
            role: 'model',
            parts: contentParts,
          });

          const toolResponseParts: any[] = [];
          for (const callPart of functionCalls) {
            const call = callPart.functionCall;
            const functionName = call.name;
            const functionArgs = call.args || {};

            let resultData: any;
            try {
              resultData = await this.executeTool(functionName, functionArgs, params.demoUserId, contextCollector);
            } catch (toolErr: any) {
              resultData = { error: toolErr.message || 'Tool execution error' };
            }

            toolResponseParts.push({
              functionResponse: {
                name: functionName,
                response: resultData,
              },
            });
          }

          // Append function response back into contents
          conversationHistory.push({
            role: 'user',
            parts: toolResponseParts,
          });
        } else {
          // Final text produced
          const textPart = contentParts.find((p: any) => Boolean(p.text));
          finalResponseText = textPart?.text || response.text || '';
          break;
        }
      }

      if (!finalResponseText && iteration >= MAX_TOOL_LOOPS) {
        finalResponseText = 'I gathered the relevant details for you. Please let me know how you would like to proceed!';
      }
    } catch (genAiError: any) {
      console.error('Gemini interaction error:', genAiError);
      throw new Error(`Gemini AI service error: ${genAiError.message}`);
    }

    // 5. Save assistant response to DB
    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: finalResponseText,
      },
    });

    // 6. Asynchronously store durable conversation facts in Mem0
    if (mem0Service.isConfigured()) {
      mem0Service.addMemory(
        [
          { role: 'user', content: params.message },
          { role: 'assistant', content: finalResponseText },
        ],
        params.demoUserId
      ).catch((err) => console.warn('Async Mem0 sync (non-fatal):', err));
    }

    return {
      conversationId: conversation.id,
      response: finalResponseText,
      interactionId: latestInteractionId,
      relatedProducts: contextCollector.relatedProducts,
      affordability: contextCollector.affordability,
      priceWatch: contextCollector.priceWatch,
    };
  }
}

export const geminiService = new GeminiService();
