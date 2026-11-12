import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  APP_BASE_URL: z.string().default('http://localhost:4000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  MORROW_SESSION_SECRET: z.string().default('morrow_super_secret_session_key_2026'),

  // Google Gemini API
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),

  // Mem0 API
  MEM0_API_KEY: z.string().optional().default(''),

  // Channel3 API
  CHANNEL3_API_KEY: z.string().optional().default(''),
  CHANNEL3_WEBHOOK_SECRET: z.string().optional().default(''),
  CHANNEL3_COUNTRY: z.string().default('US'),
  CHANNEL3_LANGUAGE: z.string().default('en'),
  CHANNEL3_CURRENCY: z.string().default('USD'),

  // PayPal Sandbox
  PAYPAL_CLIENT_ID: z.string().optional().default(''),
  PAYPAL_CLIENT_SECRET: z.string().optional().default(''),
  PAYPAL_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
  PAYPAL_CURRENCY: z.string().default('USD'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

export const integrationStatus = () => ({
  gemini: {
    configured: Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0),
    model: env.GEMINI_MODEL,
  },
  mem0: {
    configured: Boolean(env.MEM0_API_KEY && env.MEM0_API_KEY.trim().length > 0),
  },
  channel3: {
    configured: Boolean(env.CHANNEL3_API_KEY && env.CHANNEL3_API_KEY.trim().length > 0),
    webhookConfigured: Boolean(env.CHANNEL3_WEBHOOK_SECRET && env.CHANNEL3_WEBHOOK_SECRET.trim().length > 0),
    country: env.CHANNEL3_COUNTRY,
    currency: env.CHANNEL3_CURRENCY,
  },
  paypal: {
    configured: Boolean(
      env.PAYPAL_CLIENT_ID &&
      env.PAYPAL_CLIENT_SECRET &&
      env.PAYPAL_CLIENT_ID.trim().length > 0 &&
      env.PAYPAL_CLIENT_SECRET.trim().length > 0
    ),
    env: env.PAYPAL_ENV,
    currency: env.PAYPAL_CURRENCY,
  },
});
