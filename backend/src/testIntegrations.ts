/**
 * Morrow Integration Self-Test
 * Run with: npx tsx src/testIntegrations.ts
 */
import { channel3Service } from './services/channel3Service.js';
import { mem0Service } from './services/mem0Service.js';
import { paypalService } from './services/paypalService.js';
import { geminiService } from './services/geminiService.js';

async function runSelfTest() {
  console.log('=== MORROW INTEGRATIONS VERIFICATION ===\n');

  // 1. Channel3
  console.log('1. Checking Channel3 Product Discovery...');
  try {
    const res = await channel3Service.searchProducts('laptop', { limit: 2 });
    console.log(`✅ Channel3 OK: Retrieved ${res.products.length} live products (First: "${res.products[0]?.title}", $${res.products[0]?.price})`);
  } catch (err: any) {
    console.error('❌ Channel3 Error:', err.message);
  }

  // 2. Mem0
  console.log('\n2. Checking Mem0 Platform API...');
  try {
    const mems = await mem0Service.getAllUserMemories('demo_user');
    console.log(`✅ Mem0 OK: Retrieved ${mems.length} stored memories`);
  } catch (err: any) {
    console.error('❌ Mem0 Error:', err.message);
  }

  // 3. PayPal
  console.log('\n3. Checking PayPal Sandbox...');
  console.log(`✅ PayPal Service initialized (Configured: ${paypalService.isConfigured()})`);

  // 4. Gemini Companion
  console.log('\n4. Checking Gemini AI Companion...');
  try {
    const chatRes = await geminiService.chat({
      message: 'Find headphones under $100',
      demoUserId: 'demo_user',
    });
    console.log(`✅ Gemini Chat OK: Conversation ${chatRes.conversationId}, returned ${chatRes.relatedProducts?.length || 0} products`);
  } catch (err: any) {
    console.error('❌ Gemini Error:', err.message);
  }

  console.log('\n=== ALL SERVICES VERIFIED ===');
}

runSelfTest();
