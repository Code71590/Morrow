# Morrow — AI-Powered Smart Shopping & Personal Finance Companion

> **Buy better. Spend smarter.**  
> Morrow bridges the gap between e-commerce desire and personal financial discipline by calculating your real-time discretionary runway before you buy.

---

## 🌟 Overview

Modern online shopping makes spending frictionless, often leading to buyer's remorse, lifestyle creep, and derailed savings goals. **Morrow** is designed as a calm, intelligent companion that keeps your discretionary budget front and center.

Instead of generic budgeting spreadsheets or predatory "Buy Now Pay Later" schemes, Morrow calculates your **true discretionary runway**:

$$\text{Discretionary Allowance} = \text{Monthly Income} - \text{Fixed Essentials} - \text{Protected Savings} - \text{Safety Buffer}$$

Every product search, curated recommendation, live price watch, and checkout attempt is evaluated in real time against your remaining budget for the month.

---

## 🏗️ Architecture & Integrations

Morrow is engineered as a production-grade full-stack application connecting state-of-the-art AI, real-time commerce data, and payment rails:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React 19 + Vite)                      │
│   Claymorphic UI · AG Grid Ledger · Bezier Charts · Slide-out AI Panel │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST & Cookies
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Backend API (Node.js + Express)                  │
│                TypeScript · Session Auth · SQLite / Prisma             │
└──────┬────────────────────┬────────────────────┬─────────────────┬─────┘
       │                    │                    │                 │
┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐   ┌──────▼──────┐
│Google Gemini│      │ Mem0 Memory │      │  Channel3   │   │PayPal Sandbox│
│ 3.8 / Flash │      │  Platform   │      │ Commerce API│   │ Orders API  │
│  Companion  │      │ User Habits │      │Live Products│   │Idempotent v2│
└─────────────┘      └─────────────┘      └─────────────┘   └─────────────┘
```

1. **Google Gemini (3.8 / 2.0 Flash)**: Powers the conversational AI companion with function-calling capabilities, product recommendations, and financial advisory guardrails.
2. **Mem0 Memory Platform**: Manages long-term adaptive memory across sessions (brand preferences, audio/tech affinity, explicit facts, and inferred shopping habits).
3. **Channel3 Live Commerce API**: Discovers live merchant offers, compares real prices across retailers, and synchronizes product updates.
4. **PayPal Sandbox (Orders API v2)**: Real-time sandbox payment order creation, authorization, and capture with verified invoice generation.
5. **Prisma ORM & SQLite**: Complete local relational persistence for users, financial profiles, conversations, product offers, price watches, and order transactions.

---

## 🎨 Design Inspiration & Visual Aesthetic

Morrow's interface is crafted with a calm, warm-minimalist aesthetic inspired by modern editorial FinTech:
- **Warm Sand & Cream Palette**: Built on warm, soothing undertones (`#F6F3EC` canvas, `#FAF7F2` cards, `#EADDCF` borders, `#C89B67` golden amber, and `#DE873E` caramel accents).
- **Claymorphic Elevation**: Soft, diffused shadows (`rgba(180, 150, 120, 0.12)`) and generous radii (`rounded-[18px]` to `rounded-[24px]`).
- **4-Card Hero Metric Row**:
  1. **Available Discretionary**: Real-time runway with pace indicator (e.g. `₹17,550` · *₹4,023 ahead of ideal pace*).
  2. **Monthly Income**: Baseline take-home income (e.g. `₹65,000` · *Salary Active*).
  3. **Fixed Expenses**: Essential commitments (e.g. `₹32,450` · *Rent, utilities & groceries*).
  4. **Savings Goal**: Protected savings with an integrated progress bar (e.g. `₹10,000 (65%)` achieved).
- **Dual-Wave Spline Area Chart**: Organic bezier curves mapping planned discretionary allowance vs actual monthly spending across 2026, complete with interactive month hover tooltips.
- **Recent Transactions Feed**: Clean transaction history featuring circular category badges (Shopping, Dining, Transport, Subscriptions, Rent, Income) with formatted local currency.

---

## 🚀 Key Features

### 1. Dynamic Profile & Budget Configuration (Login & Logout)
- **Interactive Profile Modal**: Click on your profile avatar or name anywhere (Header, Sidebar, or Overview) to edit:
  - Display Name
  - Preferred Currency (INR ₹, USD $, EUR €, GBP £, etc.)
  - Monthly Take-Home Income
  - Fixed Essential Expenses (Rent, Bills)
  - Protected Savings Goal (SIP Reserve)
  - Emergency Safety Buffer
- **Live Recalculation**: Instant recalculation across all dashboard cards, pacing gauges, and charts without reloading.
- **Demo Login & Logout**: Full demo authentication flow with quick presets (**Alex · India ₹65k**, **Sarah · US $6.5k**, or Custom).

### 2. Copilot Money Pacing & Runway Gauge
- Real-time month-progress tracking (e.g. *Day 12 of 30 · 40% elapsed*).
- Visual pace gauge with ideal-pace marker indicating whether you are ahead or behind your planned monthly spending rate.

### 3. "Ask Morrow" AI Shopping Companion
- Slide-out conversational assistant powered by **Google Gemini** with context memory from **Mem0**.
- Real-time product search powered by **Channel3** and affordability evaluation from Morrow's financial engine.
- Interactive multi-turn chat with conversation history drawer and quick suggestion chips.

### 4. Natural-Language Product Search & Discovery
- Search products using conversational queries (e.g. *"noise-cancelling headphones under ₹25,000"*, *"a laptop for programming"*).
- Instant budget compatibility check on search results with real-time affordability labels.

### 5. Curated Recommendations & Affordability Badges
- Personalized catalog recommendations evaluated against your current financial runway:
  - 🟢 **Comfortable**: Safe to buy; consumes a minor fraction of discretionary funds.
  - 🟢 **Within Budget**: Fits comfortably within monthly allowance without compromising savings.
  - 🟡 **Pushes Budget / Budget Strain**: Exceeds ideal pacing; recommended to wait or adjust other spending.
  - 🔴 **Wait for Sale / Not Recommended**: Purchase exceeds available discretionary runway and would eat into essentials or savings.

### 6. Active Price Watches & Historical Sparklines
- Track target prices for wishlisted items with interactive trend sparklines.
- Auto-purchase or notification modes with price drop alerts.
- Interactive "Simulate Drop" demonstration button for live presentations.

### 7. PayPal Sandbox Checkout & Verified Invoices
- Safe spending guardrail: blocks purchases if remaining discretionary funds are insufficient and prompts to create a Price Watch instead.
- Integrates PayPal Sandbox Orders API v2 with idempotent capture.
- Complete printable and downloadable verified invoices with tax breakdown and order reference numbers.

### 8. Financial Insights & AG Grid Ledger Workspace
- Multi-month cash flow spline wave charts.
- Category budget tracking bars (Dining, Tech, Groceries, Utilities, etc.).
- Interactive "What-If" Budget Simulator to project the impact of large purchases.
- Enterprise-grade AG Grid Community transaction ledger with sorting, filtering, row selection, and CSV export.

### 9. Personalization & Mem0 Memory Management
- View, search, add, edit, and delete explicit facts and AI-inferred shopping habits.
- Toggle between live Gemini AI calls and deterministic pre-scripted demo responses for offline presentations.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & UI System** | Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Custom Design Tokens |
| **Data Grid & Charts** | AG Grid Community (`ag-grid-react`), AG Charts Community, Custom SVG Bezier Spline Charts |
| **Client State Management** | Zustand (with localStorage persistence) |
| **Backend Runtime & API** | Node.js, Express, TypeScript, tsx |
| **Database & ORM** | SQLite, Prisma ORM (`@prisma/client`) |
| **AI & LLM Services** | Google Gemini (`@google/genai` 3.8 / 2.0 Flash) |
| **Memory Platform** | Mem0 Platform API (`https://api.mem0.ai`) |
| **Commerce & Search** | Channel3 Real Product Search & Merchant Subscriptions |
| **Payments Integration** | PayPal Sandbox Orders API v2 (`@paypal/react-paypal-js` & backend service) |
| **Webhook Security** | Svix webhook signature verification |

---

## 📁 Monorepo Structure

```text
Hackathon Project 1/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (SQLite / Postgres portable)
│   │   └── dev.db                 # Local database storage
│   ├── src/
│   │   ├── config/                # Environment configuration (env.ts) & Prisma client
│   │   ├── middleware/            # Auth session cookies, request logging, error handling
│   │   ├── routes/                # Assistant, Products, PriceWatch, Finance, Purchases, PayPal
│   │   ├── services/              # Gemini, Mem0, Channel3, PayPal, FinancialDecision services
│   │   ├── index.ts               # Express server entry point
│   │   └── testIntegrations.ts    # Self-test script verifying external APIs
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── assistant/         # Slide-out AI Assistant (ChatPanel, ChatMessage)
│   │   │   ├── auth/              # LoginModal (Demo login & presets)
│   │   │   ├── common/            # Button, Badge, Modal, Sparkline, InvoiceModal, MorrowLogo
│   │   │   ├── finance/           # BudgetSimulator, CashFlowChart, TransactionGrid (AG Grid)
│   │   │   ├── fintech/           # Hero Metric Cards, Spend Chart, Recent Transactions
│   │   │   ├── layout/            # Sidebar, Header, MobileNavigation, PageContainer
│   │   │   ├── price-watch/       # PriceWatchCard, PriceWatchForm, PriceHistoryChart
│   │   │   ├── profile/           # ProfileBudgetModal (Name, currency, & budget editor)
│   │   │   └── shopping/          # ProductCard, ProductGrid, ProductSearch, CheckoutModal
│   │   ├── data/                  # Demo products, user profiles, transactions, budgets
│   │   ├── hooks/                 # useProducts, custom hooks
│   │   ├── pages/                 # Overview, Discover, ProductDetails, PriceWatch,
│   │   │                          # Purchases, FinancialInsights, Preferences, Onboarding
│   │   ├── services/              # API clients (assistant, products, price-watch, payment, memory)
│   │   ├── store/                 # Zustand appStore (User, FinancialProfile, Orders, Messages)
│   │   ├── styles/                # tokens.css, index.css
│   │   ├── types/                 # TypeScript interfaces (Product, Order, Financial, Memory)
│   │   └── utils/                 # Affordability math, currency formatting, date helpers
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── package.json                   # Root monorepo workspace scripts
├── .env.example                   # Master environment template
├── info.md                        # Exhaustive feature & page-by-page reference guide
└── README.md                      # Project overview & quickstart
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher; Node 20+ recommended)
- [npm](https://www.npmjs.com/)

---

### 1. Clone & Setup Environment

```bash
git clone <repository-url>
cd "Hackathon Project 1"
```

Create your `.env` file in `backend/.env` (and root if applicable). You can copy the template:

```bash
cp .env.example backend/.env
```

#### Key Environment Variables:
```env
PORT=4000
DATABASE_URL="file:./dev.db"
MORROW_SESSION_SECRET=morrow_super_secret_session_key_2026

# Google Gemini API (Get key from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

# Mem0 Platform API
MEM0_API_KEY=your_mem0_api_key_here

# Channel3 Commerce API
CHANNEL3_API_KEY=your_channel3_api_key_here

# PayPal Sandbox
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_ENV=sandbox
```

> **Note**: If API keys are not provided, Morrow automatically runs with verified offline fallback datasets and deterministic demo mock services.

---

### 2. Install Dependencies

You can install all dependencies for both frontend and backend using the root npm script:

```bash
npm run install:all
```

*(Alternatively: run `npm install` inside both `backend/` and `frontend/`)*

---

### 3. Initialize the Database

Push the Prisma schema to generate the local SQLite database:

```bash
cd backend
npm run prisma:push
cd ..
```

---

### 4. Verify External Integrations (Optional)

Run the backend integration self-test to verify connectivity to Gemini, Mem0, Channel3, and PayPal:

```bash
cd backend
npx tsx src/testIntegrations.ts
cd ..
```

---

### 5. Run the Application

Start both the backend server and frontend development server:

#### Terminal 1 — Backend:
```bash
npm run dev:backend
# Starts Express server on http://localhost:4000
```

#### Terminal 2 — Frontend:
```bash
npm run dev:frontend
# Starts Vite dev server on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Demo Walkthrough

1. **Explore the Home Screen**:
   - Inspect the **Available Discretionary** (`₹17,550`), **Monthly Income** (`₹65,000`), **Fixed Expenses** (`₹32,450`), and **Savings Goal** (`₹10,000`).
   - Hover over months on the **Monthly Spend Analysis** chart to view budget vs actual breakdown.
2. **Edit Profile & Live Recalculation**:
   - Click your profile pill in the header or sidebar.
   - Change your name, increase income to `₹80,000`, adjust savings to `₹15,000`, and click **Save Changes**.
   - Notice the entire dashboard and pacing gauge immediately recalculate your discretionary runway.
3. **Switch User Profiles & Currencies**:
   - Click the **Log Out** button in the header or sidebar.
   - Select the **Sarah (US · $6,500 USD)** preset in the Login Modal.
   - Click **Log In** to watch the entire application switch seamlessly to USD ($) and Sarah's cash flow.
4. **Natural-Language Search & Affordability**:
   - Type *"headphones"* in the search bar or click quick chips like *"Headphones under ₹25,000"*.
   - Review the green/amber affordability badges indicating whether each item is safe to buy.
5. **Simulate Sandbox Checkout & Invoice**:
   - Click "Buy Now with PayPal Sandbox" on any affordable item.
   - Complete the checkout process, watch the purchase debit from your monthly allowance, and click **Invoice** to view/print your itemized invoice.
6. **Chat with Morrow AI Companion**:
   - Click **Ask Morrow** in the header or sidebar to open the conversational slide-out panel.
   - Ask: *"Can I afford the Sony XM5 this month?"* or *"Find me wireless earbuds for running"*.
7. **Simulate Price Drop**:
   - Navigate to **Price Watch** and click **Simulate Drop** to test the alert banner and auto-buy qualification.
8. **Explore the AG Grid Financial Ledger**:
   - Navigate to **Financial Insights** to interact with the multi-column AG Grid ledger: sort, filter by category, select multiple rows to view calculated totals, or export to CSV.

---

## 📄 Documentation

For an exhaustive, page-by-page breakdown of every feature, component, route, and calculation rule in Morrow, refer to [info.md](file:///d:/Hackathon%20Project%201/info.md).

---

## 📄 License
This project was built for hackathon demonstration purposes.
