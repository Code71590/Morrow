import type { UserProfile } from '@/types/user';
import type { Transaction } from '@/types/transaction';
import type { Product } from '@/types/product';
import type { PriceWatch } from '@/types/priceWatch';
import type { Memory } from '@/types/memory';
import type { Order } from '@/types/order';
import type { FinancialProfile, Budget, MonthlyExpenseSummary } from '@/types/financial';

// ─── User (India Demo Profile) ───────────────────────────────────────────────
export const DEMO_USER: UserProfile = {
  id: 'user_alex_demo',
  displayName: 'Alex',
  currency: 'INR',
  country: 'India',
  monthlyIncome: 65000,
  hasCompletedOnboarding: true,
  createdAt: '2026-09-01T00:00:00Z',
};

// ─── Financial Profile ─────────────────────────────────────────────────────
// Discretionary = 65,000 - 32,450 - 10,000 - 3,500 - 1,500 = ₹17,550
export const DEMO_FINANCIAL_PROFILE: FinancialProfile = {
  id: 'fp_alex_demo',
  userId: 'user_alex_demo',
  monthlyIncome: 65000,
  currency: 'INR',
  essentialExpenses: 32450,
  savingsCommitment: 10000,
  upcomingCommitments: 3500,
  safetyReserve: 1500,
  availableFunds: 65000,
};

// ─── Budgets ─────────────────────────────────────────────────────────────────
export const DEMO_BUDGETS: Budget[] = [
  { id: 'b1', category: 'Shopping',          monthlyLimit: 8000,  spent: 4995, currency: 'INR' },
  { id: 'b2', category: 'Food & Dining',     monthlyLimit: 12000, spent: 8450, currency: 'INR' },
  { id: 'b3', category: 'Transport',         monthlyLimit: 4000,  spent: 2600, currency: 'INR' },
  { id: 'b4', category: 'Entertainment',     monthlyLimit: 3000,  spent: 1400, currency: 'INR' },
  { id: 'b5', category: 'Subscription',      monthlyLimit: 2000,  spent: 1699, currency: 'INR' },
  { id: 'b6', category: 'Healthcare',        monthlyLimit: 3000,  spent: 800,  currency: 'INR' },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
export const DEMO_TRANSACTIONS: Transaction[] = [
  // November 2026 (current month)
  { id: 't1',  description: 'Monthly Salary Credit',  category: 'Income',          merchant: 'Techcorp India',   amount: 65000, currency: 'INR', transactionType: 'income',  transactionDate: '2026-11-01', paymentStatus: 'completed', paymentMethod: 'Net Banking' },
  { id: 't2',  description: 'Apartment Rent',          category: 'Rent',            merchant: 'Prestige Estates', amount: 20000, currency: 'INR', transactionType: 'expense', transactionDate: '2026-11-02', paymentStatus: 'completed', paymentMethod: 'UPI' },
  { id: 't3',  description: 'Fresh Grocery Restock',   category: 'Food & Dining',   merchant: 'Nature Basket',    amount: 3850,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-11-03', paymentStatus: 'completed', paymentMethod: 'UPI' },
  { id: 't4',  description: 'Logitech MX Master 3S',   category: 'Shopping',        merchant: 'Amazon India',     amount: 8995,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-11-05', paymentStatus: 'completed', paymentMethod: 'Credit Card', source: 'manual' },
  { id: 't5',  description: 'Netflix 4K Subscription', category: 'Subscription',    merchant: 'Netflix',          amount: 649,   currency: 'INR', transactionType: 'expense', transactionDate: '2026-11-06', paymentStatus: 'completed', paymentMethod: 'Auto-debit' },
  { id: 't6',  description: 'Uber Commute Rides',      category: 'Transport',       merchant: 'Uber India',       amount: 1420,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-11-08', paymentStatus: 'completed', paymentMethod: 'UPI' },
  { id: 't7',  description: 'Weekend Dining',          category: 'Food & Dining',   merchant: 'Toit Brewpub',     amount: 2450,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-11-10', paymentStatus: 'completed', paymentMethod: 'Credit Card' },
  { id: 't8',  description: 'Spotify Individual Plan', category: 'Subscription',    merchant: 'Spotify India',    amount: 119,   currency: 'INR', transactionType: 'expense', transactionDate: '2026-11-11', paymentStatus: 'completed', paymentMethod: 'UPI' },
  // October 2026
  { id: 't9',  description: 'Monthly Salary Credit',  category: 'Income',          merchant: 'Techcorp India',   amount: 65000, currency: 'INR', transactionType: 'income',  transactionDate: '2026-10-01', paymentStatus: 'completed', paymentMethod: 'Net Banking' },
  { id: 't10', description: 'Apartment Rent',          category: 'Rent',            merchant: 'Prestige Estates', amount: 20000, currency: 'INR', transactionType: 'expense', transactionDate: '2026-10-02', paymentStatus: 'completed', paymentMethod: 'UPI' },
  { id: 't11', description: 'Sony WH-1000XM5 Capture',category: 'Shopping',        merchant: 'Amazon India',     amount: 24990, currency: 'INR', transactionType: 'expense', transactionDate: '2026-10-14', paymentStatus: 'completed', paymentMethod: 'PayPal',     source: 'paypal' },
  { id: 't12', description: 'Weekly Supermarket Haul', category: 'Food & Dining',   merchant: 'BigBasket',        amount: 2890,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-10-10', paymentStatus: 'completed', paymentMethod: 'UPI' },
  { id: 't13', description: 'PVR IMAX Movie Tickets',  category: 'Entertainment',   merchant: 'BookMyShow',       amount: 950,   currency: 'INR', transactionType: 'expense', transactionDate: '2026-10-20', paymentStatus: 'completed', paymentMethod: 'Credit Card' },
  { id: 't14', description: 'Electricity & Utilities', category: 'Utilities',       merchant: 'BESCOM',           amount: 2100,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-10-22', paymentStatus: 'completed', paymentMethod: 'Auto-debit' },
  { id: 't15', description: 'Doctor Consultation',     category: 'Healthcare',      merchant: 'Apollo Clinic',    amount: 1200,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-10-25', paymentStatus: 'completed', paymentMethod: 'UPI' },
  // September 2026
  { id: 't16', description: 'Monthly Salary Credit',  category: 'Income',          merchant: 'Techcorp India',   amount: 65000, currency: 'INR', transactionType: 'income',  transactionDate: '2026-09-01', paymentStatus: 'completed', paymentMethod: 'Net Banking' },
  { id: 't17', description: 'Apartment Rent',          category: 'Rent',            merchant: 'Prestige Estates', amount: 20000, currency: 'INR', transactionType: 'expense', transactionDate: '2026-09-02', paymentStatus: 'completed', paymentMethod: 'UPI' },
  { id: 't18', description: 'Anker Soundcore Q45',     category: 'Shopping',        merchant: 'Amazon India',     amount: 4999,  currency: 'INR', transactionType: 'expense', transactionDate: '2026-09-15', paymentStatus: 'completed', paymentMethod: 'Credit Card' },
];

// ─── Products (Realistic INR Pricing) ────────────────────────────────────────
export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p001', title: 'Sony WH-1000XM5 Noise-Canceling Headphones', brand: 'Sony', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
    price: 24990, currency: 'INR', merchant: 'Amazon India',
    rating: 4.8, reviewCount: 12847,
    description: 'Industry-leading noise canceling headphones with Speak-to-Chat technology and up to 30-hour battery life. Two processors and eight microphones for unprecedented ANC performance.',
    attributes: [
      { name: 'Battery Life', value: '30 hours' },
      { name: 'Noise Cancellation', value: 'Dual Processor LDAC' },
      { name: 'Weight', value: '250g' },
      { name: 'Connectivity', value: 'Bluetooth 5.2 & Multipoint' },
      { name: 'Microphone', value: '4 beamforming mics' },
    ],
    tags: ['wireless', 'noise-cancelling', 'travel', 'premium', 'over-ear'],
    isMock: true,
  },
  {
    id: 'p002', title: 'Apple AirPods Pro (2nd Generation)', brand: 'Apple', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop',
    price: 19990, currency: 'INR', merchant: 'Apple Store India',
    rating: 4.7, reviewCount: 8923,
    description: 'Rebuilt from the ground up with Apple H2 chip, delivering up to 2x more Active Noise Cancellation and Adaptive Transparency for crystal-clear calls and immersive acoustics.',
    attributes: [
      { name: 'Battery Life', value: '6h (30h with MagSafe case)' },
      { name: 'Noise Cancellation', value: 'Active ANC & Adaptive Audio' },
      { name: 'Water Resistance', value: 'IP54 dust & sweat' },
      { name: 'Processor', value: 'Apple H2 Headphone Chip' },
    ],
    tags: ['wireless', 'earbuds', 'noise-cancelling', 'apple', 'in-ear'],
    isMock: true,
  },
  {
    id: 'p003', title: 'Samsung Galaxy Buds3 Pro', brand: 'Samsung', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop',
    price: 15999, currency: 'INR', merchant: 'Samsung India',
    rating: 4.5, reviewCount: 3421,
    description: 'Blade design earbuds featuring Intelligent Active Noise Cancellation, 24-bit Hi-Fi audio, and 360 Audio for rich cinematic spatial sound.',
    attributes: [
      { name: 'Battery Life', value: '7h (30h with case)' },
      { name: 'Noise Cancellation', value: 'Intelligent Adaptive ANC' },
      { name: 'Water Resistance', value: 'IPX7 immersion' },
      { name: 'Audio Codec', value: 'Samsung Seamless 24-bit' },
    ],
    tags: ['wireless', 'earbuds', 'samsung', 'android', 'in-ear'],
    isMock: true,
  },
  {
    id: 'p004', title: 'Logitech MX Master 3S Wireless Mouse', brand: 'Logitech', category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop',
    price: 8995, currency: 'INR', merchant: 'Amazon India',
    rating: 4.9, reviewCount: 15234,
    description: 'The master series benchmark for software engineers and designers. Features 8K DPI Darkfield tracking that works on glass, quiet clicks, and MagSpeed electromagnetic scrolling.',
    attributes: [
      { name: 'DPI Sensor', value: '200–8000 DPI Darkfield' },
      { name: 'Battery', value: 'USB-C Rechargeable (70 days)' },
      { name: 'Connectivity', value: 'Bluetooth & Logi Bolt' },
      { name: 'Scroll Wheel', value: 'MagSpeed Electromagnetic' },
      { name: 'Custom Buttons', value: '7 programmable triggers' },
    ],
    tags: ['mouse', 'productivity', 'wireless', 'ergonomic', 'office'],
    isMock: true,
  },
  {
    id: 'p005', title: 'iPad Air 13-inch (M2 Chip, 128GB)', brand: 'Apple', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop',
    price: 79900, currency: 'INR', merchant: 'Apple Store India',
    rating: 4.8, reviewCount: 4567,
    description: 'Supercharged by the blazing M2 chip. Features an expansive 13-inch Liquid Retina display, landscape stereo speakers, and full support for Apple Pencil Pro.',
    attributes: [
      { name: 'Chip', value: 'Apple M2 with 8-core CPU' },
      { name: 'Display', value: '13" Liquid Retina 2732x2048' },
      { name: 'Storage', value: '128GB High-speed SSD' },
      { name: 'Battery', value: 'Up to 10 hours web surfing' },
      { name: 'Camera', value: '12MP Center Stage Ultra Wide' },
    ],
    tags: ['tablet', 'apple', 'creative', 'portable', 'productivity'],
    isMock: true,
  },
  {
    id: 'p006', title: 'Anker Soundcore Space Q45 ANC Headphones', brand: 'Anker', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    price: 4999, currency: 'INR', merchant: 'Amazon India',
    rating: 4.4, reviewCount: 7832,
    description: 'Premium value wireless headphones boasting up to 50 hours of battery life with ANC enabled, LDAC Hi-Res Wireless certification, and adaptive noise cancellation.',
    attributes: [
      { name: 'Battery Life', value: '50h ANC (65h Standard)' },
      { name: 'Noise Cancellation', value: '3-Stage Adaptive ANC' },
      { name: 'Fast Charge', value: '5 min charge = 4 hours' },
      { name: 'Audio Drivers', value: '40mm Double-Layer' },
    ],
    tags: ['wireless', 'budget', 'noise-cancelling', 'travel', 'over-ear'],
    isMock: true,
  },
  {
    id: 'p007', title: 'Samsung Galaxy Book 4 Pro (14-inch OLED)', brand: 'Samsung', category: 'Computers',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop',
    price: 119990, currency: 'INR', merchant: 'Samsung India',
    rating: 4.6, reviewCount: 892,
    description: 'Ultra-thin engineering powered by Intel Core Ultra 7 with dedicated NPU for local AI workflows, vibrant Dynamic AMOLED 2X 120Hz display, and 1.2kg portable chassis.',
    attributes: [
      { name: 'Processor', value: 'Intel Core Ultra 7 155H' },
      { name: 'RAM', value: '16GB LPDDR5X' },
      { name: 'Storage', value: '512GB PCIe 4.0 NVMe' },
      { name: 'Display', value: '14" 3K AMOLED 120Hz' },
      { name: 'Weight', value: '1.23 kg' },
    ],
    tags: ['laptop', 'premium', 'thin-light', 'windows', 'intel'],
    isMock: true,
  },
  {
    id: 'p008', title: 'Amazon Kindle Paperwhite (16GB, Warm Light)', brand: 'Amazon', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
    price: 11999, currency: 'INR', merchant: 'Amazon India',
    rating: 4.7, reviewCount: 28934,
    description: 'Now with a larger 7-inch 300 ppi glare-free display, adjustable warm light, IPX8 waterproof build, and up to 10 weeks of battery life per charge.',
    attributes: [
      { name: 'Display', value: '7" 300 ppi glare-free E-ink' },
      { name: 'Storage', value: '16GB for thousands of books' },
      { name: 'Battery', value: 'Up to 10 weeks' },
      { name: 'Waterproofing', value: 'IPX8 rated' },
      { name: 'Lighting', value: 'Adjustable warm amber light' },
    ],
    tags: ['ereader', 'reading', 'compact', 'travel', 'amazon'],
    isMock: true,
  },
  {
    id: 'p009', title: 'Bose QuietComfort 45 Wireless Headphones', brand: 'Bose', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop',
    price: 21990, currency: 'INR', merchant: 'Bose India',
    rating: 4.6, reviewCount: 6103,
    description: 'The iconic comfort benchmark. Features high-fidelity audio with proprietary acoustic technology, Quiet Mode for full immersion, and Aware Mode for situational hearing.',
    attributes: [
      { name: 'Battery Life', value: '24 hours on single charge' },
      { name: 'Noise Cancellation', value: 'Quiet & Aware Modes' },
      { name: 'Weight', value: '238g lightweight luxury' },
      { name: 'Quick Charge', value: '15 min = 3 hours playback' },
    ],
    tags: ['wireless', 'noise-cancelling', 'bose', 'travel', 'over-ear'],
    isMock: true,
  },
  {
    id: 'p010', title: 'Apple Watch Series 10 (GPS 46mm)', brand: 'Apple', category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop',
    price: 41900, currency: 'INR', merchant: 'Apple Store India',
    rating: 4.8, reviewCount: 5421,
    description: 'The thinnest Apple Watch ever made with the largest active screen area, advanced ECG and sleep apnea notifications, and fast charging up to 80% in 30 minutes.',
    attributes: [
      { name: 'Display', value: '46mm Wide-angle Always-On OLED' },
      { name: 'Sensors', value: 'ECG, Blood Oxygen, Temperature' },
      { name: 'Water Resistance', value: '50m swimproof + depth gauge' },
      { name: 'Battery', value: '18h standard / 36h Low Power' },
    ],
    tags: ['smartwatch', 'health', 'apple', 'fitness', 'wearable'],
    isMock: true,
  },
];

// ─── Price Watches (INR Values & Step-Down History) ──────────────────────────
export const DEMO_PRICE_WATCHES: PriceWatch[] = [
  {
    id: 'pw001',
    productId: 'p001',
    product: DEMO_PRODUCTS[0],
    targetPrice: 22500,
    maximumTotalPrice: 23500,
    currency: 'INR',
    purchaseMode: 'notify',
    affordabilityRequired: true,
    status: 'active',
    initialPrice: 29990,
    currentPrice: 24990,
    priceHistory: [
      { id: 'po1', productId: 'p001', price: 29990, currency: 'INR', merchant: 'Amazon India', observedAt: '2026-10-01T10:00:00Z' },
      { id: 'po2', productId: 'p001', price: 27990, currency: 'INR', merchant: 'Amazon India', observedAt: '2026-10-15T10:00:00Z' },
      { id: 'po3', productId: 'p001', price: 25990, currency: 'INR', merchant: 'Amazon India', observedAt: '2026-11-01T10:00:00Z' },
      { id: 'po4', productId: 'p001', price: 24990, currency: 'INR', merchant: 'Amazon India', observedAt: '2026-11-10T10:00:00Z' },
    ],
    lastCheckedAt: '2026-11-12T15:00:00Z',
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'pw002',
    productId: 'p005',
    product: DEMO_PRODUCTS[4],
    targetPrice: 74900,
    maximumTotalPrice: 76000,
    currency: 'INR',
    purchaseMode: 'prepare_checkout',
    affordabilityRequired: false,
    status: 'active',
    initialPrice: 79900,
    currentPrice: 79900,
    priceHistory: [
      { id: 'po5', productId: 'p005', price: 79900, currency: 'INR', merchant: 'Apple Store India', observedAt: '2026-10-20T10:00:00Z' },
      { id: 'po6', productId: 'p005', price: 79900, currency: 'INR', merchant: 'Apple Store India', observedAt: '2026-11-05T10:00:00Z' },
    ],
    lastCheckedAt: '2026-11-12T14:00:00Z',
    createdAt: '2026-10-20T09:00:00Z',
  },
  {
    id: 'pw003',
    productId: 'p007',
    product: DEMO_PRODUCTS[6],
    targetPrice: 112000,
    maximumTotalPrice: 115000,
    currency: 'INR',
    purchaseMode: 'auto_purchase',
    affordabilityRequired: true,
    status: 'active',
    initialPrice: 129990,
    currentPrice: 119990,
    rule: {
      id: 'pr001',
      priceWatchId: 'pw003',
      maxQuantity: 1,
      authorized: true,
      authorizationNote: 'Pre-approved sandbox demonstration buy on 2026-11-10',
    },
    priceHistory: [
      { id: 'po7', productId: 'p007', price: 129990, currency: 'INR', merchant: 'Samsung India', observedAt: '2026-09-15T10:00:00Z' },
      { id: 'po8', productId: 'p007', price: 124990, currency: 'INR', merchant: 'Samsung India', observedAt: '2026-10-01T10:00:00Z' },
      { id: 'po9', productId: 'p007', price: 119990, currency: 'INR', merchant: 'Samsung India', observedAt: '2026-11-01T10:00:00Z' },
    ],
    lastCheckedAt: '2026-11-12T13:00:00Z',
    createdAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'pw004',
    productId: 'p010',
    product: DEMO_PRODUCTS[9],
    targetPrice: 38500,
    maximumTotalPrice: 39500,
    currency: 'INR',
    purchaseMode: 'notify',
    affordabilityRequired: false,
    status: 'active',
    initialPrice: 41900,
    currentPrice: 41900,
    priceHistory: [
      { id: 'po10', productId: 'p010', price: 41900, currency: 'INR', merchant: 'Apple Store India', observedAt: '2026-11-01T10:00:00Z' },
      { id: 'po11', productId: 'p010', price: 41900, currency: 'INR', merchant: 'Apple Store India', observedAt: '2026-11-10T10:00:00Z' },
    ],
    lastCheckedAt: '2026-11-12T12:00:00Z',
    createdAt: '2026-11-01T09:00:00Z',
  },
];

// ─── Memories ──────────────────────────────────────────────────────────────────
export const DEMO_MEMORIES: Memory[] = [
  { id: 'm1', category: 'brand_preference',    content: 'Prefers Sony and Apple products for audio and consumer electronics.', source: 'explicit',  confidence: 1,    createdAt: '2026-10-05T10:00:00Z', updatedAt: '2026-10-05T10:00:00Z', tags: ['brand', 'audio', 'sony', 'apple'] },
  { id: 'm2', category: 'shopping_preference', content: 'Interested in wireless noise-cancelling headphones for travel and daily Bangalore commute.', source: 'explicit', confidence: 1, createdAt: '2026-10-10T14:00:00Z', updatedAt: '2026-10-10T14:00:00Z', tags: ['audio', 'travel', 'wireless'] },
  { id: 'm3', category: 'financial_preference',content: 'Prefers to keep individual shopping purchases under ₹15,000 per month to maintain protected savings target.', source: 'inferred', confidence: 0.85, createdAt: '2026-10-15T09:00:00Z', updatedAt: '2026-11-01T09:00:00Z', tags: ['budget', 'shopping', 'savings'] },
  { id: 'm4', category: 'product_interest',    content: 'Interested in Samsung Galaxy Book 4 Pro laptop (~₹1,19,990). Postponed due to exceeding monthly discretionary runway.', source: 'explicit', confidence: 1, createdAt: '2026-10-20T16:00:00Z', updatedAt: '2026-10-20T16:00:00Z', tags: ['laptop', 'postponed', 'samsung', 'computing'] },
  { id: 'm5', category: 'purchase_decision',   content: 'Bought Logitech MX Master 3S (₹8,995) in November 2026 from Amazon India for home workstation setup.', source: 'system', confidence: 1, createdAt: '2026-11-05T12:00:00Z', updatedAt: '2026-11-05T12:00:00Z', tags: ['purchase', 'peripherals', 'office', 'completed'] },
  { id: 'm6', category: 'personal_goal',       content: 'Saving ₹10,000 per month toward an emergency fund SIP. Target: ₹1,50,000 total. Currently at ~₹65,000.', source: 'explicit', confidence: 1, createdAt: '2026-09-01T10:00:00Z', updatedAt: '2026-09-01T10:00:00Z', tags: ['savings', 'emergency-fund', 'financial-goal'] },
  { id: 'm7', category: 'shopping_preference', content: 'Strongly values long battery life and ear cushion comfort for extended flights. Dislikes heavy clamps.', source: 'inferred', confidence: 0.78, createdAt: '2026-10-12T11:00:00Z', updatedAt: '2026-10-12T11:00:00Z', tags: ['battery', 'comfort', 'travel'] },
  { id: 'm8', category: 'purchase_decision',   content: 'Favored Sony WH-1000XM5 (₹24,990) over AirPods Max due to lightweight comfort and superior LDAC wireless codec support.', source: 'explicit', confidence: 1, createdAt: '2026-10-14T15:00:00Z', updatedAt: '2026-10-14T15:00:00Z', tags: ['audio', 'comparison', 'sony'] },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const DEMO_ORDERS: Order[] = [
  {
    id: 'ord001',
    userId: 'user_alex_demo',
    items: [{
      id: 'oi1',
      productId: 'p001',
      productTitle: 'Sony WH-1000XM5 Noise-Canceling Headphones',
      productImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
      quantity: 1,
      unitPrice: 24990,
      currency: 'INR',
    }],
    merchant: 'Amazon India',
    totalAmount: 24990,
    currency: 'INR',
    paypalOrderId: 'PP-IN-SANDBOX-8921',
    orderStatus: 'completed',
    source: 'manual',
    createdAt: '2026-10-14T16:00:00Z',
    completedAt: '2026-10-14T16:05:22Z',
    notes: 'Verified sandbox demonstration order — captured successfully',
  },
  {
    id: 'ord002',
    userId: 'user_alex_demo',
    items: [{
      id: 'oi2',
      productId: 'p004',
      productTitle: 'Logitech MX Master 3S Wireless Mouse',
      productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop',
      quantity: 1,
      unitPrice: 8995,
      currency: 'INR',
    }],
    merchant: 'Amazon India',
    totalAmount: 8995,
    currency: 'INR',
    orderStatus: 'completed',
    source: 'manual',
    createdAt: '2026-11-05T12:30:00Z',
    completedAt: '2026-11-05T12:35:11Z',
  },
];

// ─── Monthly Summaries (INR Aggregates) ───────────────────────────────────────
export const DEMO_MONTHLY_SUMMARIES: MonthlyExpenseSummary[] = [
  {
    month: '2026-11', year: 2026, monthName: 'November 2026',
    totalIncome: 65000, totalExpenses: 32450, netSavings: 32550,
    byCategory: { 'Rent': 20000, 'Food & Dining': 6300, 'Transport': 1420, 'Subscription': 768, 'Shopping': 8995 },
  },
  {
    month: '2026-10', year: 2026, monthName: 'October 2026',
    totalIncome: 65000, totalExpenses: 34200, netSavings: 30800,
    byCategory: { 'Rent': 20000, 'Shopping': 24990, 'Food & Dining': 2890, 'Entertainment': 950, 'Utilities': 2100, 'Healthcare': 1200 },
  },
  {
    month: '2026-09', year: 2026, monthName: 'September 2026',
    totalIncome: 65000, totalExpenses: 29800, netSavings: 35200,
    byCategory: { 'Rent': 20000, 'Shopping': 4999, 'Food & Dining': 4801 },
  },
];
