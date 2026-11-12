# Morrow — Comprehensive Product & Feature Documentation

> **Morrow: Buy better. Spend smarter.**  
> An intelligent personal finance and smart shopping companion that evaluates every purchasing decision against your real-time discretionary runway before you spend.

---

## Table of Contents

1. [Executive Summary & Core Philosophy](#1-executive-summary--core-philosophy)
2. [The Financial Engine: Discretionary Runway Formula](#2-the-financial-engine-discretionary-runway-formula)
3. [Master Feature Catalog](#3-master-feature-catalog)
4. [Complete Page-by-Page Deep Dive](#4-complete-page-by-page-deep-dive)
   - [Page 1: Overview (`/`)](#page-1-overview-)
   - [Page 2: Discover (`/discover`)](#page-2-discover-discover)
   - [Page 3: Product Details (`/product/:id`)](#page-3-product-details-productid)
   - [Page 4: Price Watch (`/price-watch`)](#page-4-price-watch-price-watch)
   - [Page 5: My Purchases (`/purchases`)](#page-5-my-purchases-purchases)
   - [Page 6: Financial Insights (`/insights`)](#page-6-financial-insights-insights)
   - [Page 7: Personalization & Memory (`/preferences`)](#page-7-personalization--memory-preferences)
   - [Page 8: Onboarding (`/onboarding`)](#page-8-onboarding-onboarding)
5. [Global Components & Interactive Modals](#5-global-components--interactive-modals)
   - [Header & Global Search](#header--global-search)
   - [Sidebar & Mobile Navigation](#sidebar--mobile-navigation)
   - [Slide-Out AI Assistant ("Ask Morrow")](#slide-out-ai-assistant-ask-morrow)
   - [Login & Demo Authentication Modal](#login--demo-authentication-modal)
   - [Profile & Budget Adjustment Modal](#profile--budget-adjustment-modal)
   - [Checkout & Affordability Guardrail Modal](#checkout--affordability-guardrail-modal)
   - [Printable / Exportable Purchase Invoice Modal](#printable--exportable-purchase-invoice-modal)
   - [Price Watch Rule Creator Modal](#price-watch-rule-creator-modal)
   - [Memory Record Modal](#memory-record-modal)
6. [Backend Integrations & Agentic Architecture](#6-backend-integrations--agentic-architecture)
   - [Google Gemini 3.8 / 2.0 Flash](#google-gemini-38--20-flash)
   - [Mem0 Long-Term Memory Platform](#mem0-long-term-memory-platform)
   - [Channel3 Live Commerce API](#channel3-live-commerce-api)
   - [PayPal Sandbox Orders API v2](#paypal-sandbox-orders-api-v2)
   - [Prisma ORM & SQLite Database](#prisma-orm--sqlite-database)
7. [Affordability Decision Matrix](#7-affordability-decision-matrix)
8. [Multi-Currency & Multi-Locale Support](#8-multi-currency--multi-locale-support)

---

## 1. Executive Summary & Core Philosophy

Modern e-commerce platforms are explicitly engineered to eliminate friction from spending: 1-click checkout, algorithmic temptation, and predatory "Buy Now Pay Later" schemes entice consumers into purchases divorced from their true financial reality.

**Morrow** flips this dynamic on its head. Instead of asking:
> *"Can my credit card or bank account cover this transaction right now?"*

Morrow answers:
> *"How does this purchase impact my actual discretionary runway after accounting for rent, bills, emergency buffers, and monthly savings goals?"*

Morrow operates not as an alarming auditor, but as a calm, editorial FinTech advisor that embeds financial awareness directly into the product discovery and checkout experience.

---

## 2. The Financial Engine: Discretionary Runway Formula

Morrow's financial decision engine uses a deterministic formula to calculate true purchasing power:

$$\text{Discretionary Runway} = \text{Available Funds} - \text{Essential Commitments} - \text{Protected Savings} - \text{Safety Buffer} - \text{Upcoming Bills}$$

### Variables Breakdown:
1. **Available Funds / Monthly Income**: Baseline take-home cash inflow for the current monthly cycle.
2. **Essential Commitments**: Non-negotiable fixed living expenses (rent, mortgage, groceries, utilities, insurance, transit).
3. **Protected Savings (SIP Reserve)**: Inviolable wealth-building allocation (retirement SIP, emergency fund deposit, mutual fund investments).
4. **Safety Buffer**: Contingency reserve for unanticipated mid-month expenses.
5. **Upcoming Commitments**: Unbilled pending subscriptions or recurring bills scheduled before next payday.

### Copilot Money Pacing Velocity:
To assess whether a user is spending too quickly within the month, Morrow computes **Spending Velocity**:
$$\text{Month Progress (\%)} = \frac{\text{Current Day}}{\text{Days in Month}} \times 100$$
$$\text{Ideal Discretionary Spent} = \frac{\text{Monthly Discretionary Allowance} \times \text{Current Day}}{\text{Days in Month}}$$
$$\text{Pacing Difference} = \text{Ideal Discretionary Spent} - \text{Actual Discretionary Spent}$$

- If **Pacing Difference > 0**: The user is spending slower than the calendar day, accumulating a safety buffer (e.g. *₹4,023 ahead of ideal pace*).
- If **Pacing Difference < 0**: Spending velocity is elevated, alerting the companion to recommend waiting or staggering non-urgent purchases.

---

## 3. Master Feature Catalog

| Feature | Description | Primary Location |
|---|---|---|
| **Discretionary Runway Engine** | Live recalculation of safe-to-spend funds across every screen | Overview, Header, Product Details, Insights |
| **Copilot Money Pacing Gauge** | Visual dual-marker gauge comparing month elapsed % to spending % | Overview, Insights |
| **"Ask Morrow" AI Companion** | Multi-turn contextual chat powered by Google Gemini with tool calling | Slide-out Drawer (Global) |
| **Adaptive User Memory** | Long-term memory tracking brand preferences, sizing, and boundaries via Mem0 | Preferences, Assistant |
| **Multi-Merchant Discovery** | Real-time multi-retailer product search and offers powered by Channel3 | Discover, Search, Product Details |
| **Affordability Badges** | Instant rating (Comfortable, Within Budget, Pushes Budget, Wait for Sale) | Product Cards, Details, Checkout |
| **Safe Spending Guardrail** | Hard stop preventing purchases that exceed available discretionary runway | Checkout Modal |
| **Active Price Watch Tracking** | SKU monitoring with custom target prices, alerts, and sparkline trends | Price Watch, Product Details |
| **Interactive Price Drop Demo** | Presentation tool to simulate instant price reductions and triggers | Price Watch (`Simulate Drop`) |
| **PayPal Sandbox Checkout** | Simulated and real-time capture of orders via PayPal Sandbox Orders API v2 | Checkout Modal, Purchases |
| **Printable Purchase Invoices** | Formal invoice generation with tax breakdown, merchant guarantee, and print dialog | Purchases, Checkout |
| **AG Grid Financial Ledger** | Enterprise-grade transaction grid with sort, filter, selection sum, and CSV export | Financial Insights |
| **Interactive Budget Simulator** | "What-if" calculator projecting post-purchase financial runway | Financial Insights |
| **Multi-Profile Demo Switcher** | 1-click presets for demo personas (Alex ₹65k INR, Sarah $6.5k USD) | Login Modal, Profile Modal |
| **Dual AI Execution Modes** | Toggle between live Gemini AI calls and deterministic pre-scripted demo responses | Preferences, Chat Panel |

---

## 4. Complete Page-by-Page Deep Dive

```text
Application Sitemap:
├── / (Overview)
├── /discover (Product Catalog & Natural Search)
├── /product/:id (Product Details & Merchant Comparison)
├── /price-watch (Price Watchlist & Automation)
├── /purchases (Order History & Invoices)
├── /insights (Cash Flow & AG Grid Ledger)
├── /preferences (Mem0 Memories & Profile Settings)
└── /onboarding (Initial Setup Flow)
```

---

### Page 1: Overview (`/`)
**Route**: `/`  
**Purpose**: The executive command center combining high-level cash flow status, money pacing velocity, conversational search, personalized shopping recommendations, active price watches, and recent purchase activity.

#### Key Sections & Components:
1. **Header Greeting & Status Banner**:
   - Time-sensitive greeting: *"Good evening, Alex"*.
   - Live pacing status pill with emerald dot: *"Spending on track · Pacing well"*.
   - Contextual subtitle calculating exact pacing lead: *"Your spending is pacing ₹4,023 ahead of schedule..."*
   - Primary action buttons: **Ask Morrow** (opens AI assistant) and **Add Price Watch** (opens rule modal).
2. **4-Card Hero FinTech Metric Tiles (`FintechMetricCards.tsx`)**:
   - **Available Discretionary**: Big number displaying remaining runway (e.g. `₹17,550`) with subtext *"₹4,023 ahead of ideal pace"*.
   - **Monthly Income**: Baseline take-home salary (`₹65,000`) with *"Salary Active"* badge.
   - **Fixed Expenses**: Essential recurring obligations (`₹32,450`) with *"Rent, bills & utilities"* subtext.
   - **Savings Goal**: Protected savings amount (`₹10,000`) with integrated visual progress bar showing goal achievement (65%).
3. **Hero Analytics Grid**:
   - **Monthly Spend Analysis (`MonthlySpendChart.tsx`)**: Interactive Bezier spline area chart charting planned budget curve vs actual monthly spending across all 12 months of 2026, complete with interactive hover tooltips.
   - **Recent Transactions Feed (`RecentTransactionsList.tsx`)**: Clean ledger of the latest transactions with circular category badges (Shopping, Dining, Transport, Subscriptions, Rent, Salary), merchant names, relative dates, and formatted currency values.
4. **Copilot Money Pacing Runway Gauge**:
   - Prominent dark forest slate card displaying total discretionary runway (`₹17,550`).
   - Month progression counter: *"Day 12 of 30 (40% month elapsed)"*.
   - Progress bar with two synchronized indicators:
     - Vertical white marker indicating calendar progress (40%).
     - Filled caramel bar indicating actual spend progress (22%).
   - Supporting breakdown mini-cards: Monthly Income, Fixed Expenses, and Protected SIP reserve.
5. **Conversational Product Search Bar**:
   - Full-width natural language input field: *"Describe what you're looking for (e.g. noise-cancelling headphones under ₹25,000)..."*
   - Dual actions: **Ask Morrow** (sends query directly to Gemini AI) or **Find Products** (filters catalog).
   - Quick search chips:
     - *"Headphones under ₹25,000"*
     - *"A laptop for programming"*
     - *"Running shoes for daily use"*
6. **Curated Recommendations Grid (`ProductCard.tsx`)**:
   - 4-column responsive grid displaying personalized picks (Sony WH-1000XM5, Apple AirPods Pro 2, Logitech MX Master 3S, etc.).
   - Each card displays merchant domain, product photography, title, rating, price, affordability badge, and quick action buttons (**Track** or **Buy**).
7. **Active Price Watches Strip (`Sparkline.tsx`)**:
   - List of items currently under price surveillance.
   - Displays thumbnail, target price, historical SVG sparkline, current price, and net drop amount.
8. **Recent Purchases Feed**:
   - Summary of orders placed through Morrow with PayPal Sandbox verification indicators.

---

### Page 2: Discover (`/discover`)
**Route**: `/discover`  
**Purpose**: Editorial shopping catalog with natural-language filtering, category faceting, price threshold filtering, and multi-product comparison.

#### Key Sections & Components:
1. **Search & Filter Toolbar (`ProductSearch.tsx`)**:
   - Search input supporting keywords, brands, and categories.
   - Category filter pills: All, Audio, Electronics, Footwear, Furniture, Accessories.
   - Price range slider with minimum and maximum values.
   - "In Stock Only" toggle switch.
   - Reset filters button.
2. **Suitability & Budget Ranking Header**:
   - Item counter: *"Showing X available items"*.
   - Verification badge: *"Ranked by suitability & budget fit"*.
3. **Product Catalog Grid (`ProductGrid.tsx`)**:
   - Multi-column grid rendering `ProductCard` components.
   - Dynamic affordability evaluation based on user's current discretionary balance.
   - "Compare" checkbox enabling multi-product comparison.
4. **Floating Product Comparison Dock**:
   - Slides up from the bottom when 1 or more items are selected for comparison (maximum 3 items).
   - Shows selected product tags with 1-click removal.
   - Displays "Clear all" button.
5. **Modals Mounted**:
   - `PriceWatchForm` for instant price tracking.
   - `CheckoutModal` for direct sandbox checkout.

---

### Page 3: Product Details (`/product/:id`)
**Route**: `/product/:id`  
**Purpose**: In-depth evaluation of an individual product, comparing real-time merchant prices, inspecting historical price trends, and assessing mathematical affordability against the user's budget.

#### Key Sections & Components:
1. **Breadcrumb Navigation**:
   - Back button to `/discover`.
   - Hierarchy trail: `Catalog / [Category] / [Brand]`.
2. **Left Column (Visuals & History)**:
   - **Dominant Photography**: Large high-resolution product imagery with zoom effect on hover.
   - **Preference Verified Badge**: Indicates alignment with user's stored Mem0 preferences.
   - **Merchant Guarantee Pills**: Direct merchant link, delivery terms, and star rating with review counts.
   - **Historical Price Trend Chart (`PriceHistoryChart.tsx`)**: Multi-point Bezier chart graphing recorded price observations across previous months with target price reference threshold.
3. **Right Column (Purchasing & Affordability)**:
   - Brand, title, current price, and "Verified Best Price" badge.
   - Editorial product description.
   - **Finish / Variant Selector**: Color chips with live selection (e.g. Matte Black, Warm Chalk, Forest Slate).
   - **Live Merchant Price Check**: Real-time price comparison across multiple retailers (e.g. Amazon, Croma Retail, Reliance Digital).
   - **Financial Affordability Assessment Card**:
     - Status badge: `COMFORTABLE`, `WITHIN BUDGET`, or `BUDGET STRAIN`.
     - Natural-language explanation of how the purchase affects monthly cash flow.
     - Dual metric columns: **Current Discretionary Runway** vs **Post-Purchase Runway**.
   - **Action Buttons**:
     - **Buy Now with PayPal Sandbox** (Primary prominent button).
     - **Add to Price Watch / Update Price Watch Rules** (Secondary outline button).
   - **Technical Specifications**: Detailed key-value attributes table (Driver size, Battery life, Weight, Connectivity, Warranty).

---

### Page 4: Price Watch (`/price-watch`)
**Route**: `/price-watch`  
**Purpose**: Automated price intelligence dashboard allowing users to track product price drops, configure automated auto-buy triggers, and simulate drops for presentation testing.

#### Key Sections & Components:
1. **Page Action Header**:
   - **Simulate Drop Button**: Interactive test trigger that drops the price of a monitored product below target price to simulate webhook triggers and notifications.
   - **Create Watch Button**: Opens the `PriceWatchForm` modal.
2. **Simulation Notification Toast**:
   - Emerald banner appearing when a price drop is triggered, showing product title, new price, and auto-buy or alert status.
3. **Summary Metric Cards**:
   - **Active Monitored SKUs**: Total count of items tracked.
   - **Auto-Buy Authorized**: Number of items approved for autonomous sandbox purchase upon reaching target price.
   - **Recent Price Drops**: Count of items currently trading below initial baseline.
4. **View Mode Switcher**:
   - Toggle between **Rows (Table View)** and **Cards (Grid View)**.
5. **Interactive Watchlist Table / Grid**:
   - Thumbnail and full product title (clickable to `/product/:id`).
   - Current recorded price.
   - Target alert threshold.
   - Inline SVG Sparkline showing historical price movement.
   - Status badge (`Active`, `Auto-Purchase`, or `Paused`).
   - Action controls: Edit rule, Pause watch, Delete watch, or Buy Now.

---

### Page 5: My Purchases (`/purchases`)
**Route**: `/purchases`  
**Purpose**: Formal ledger of all purchases executed through Morrow or triggered via automated price watches, featuring PayPal sandbox capture IDs and printable invoices.

#### Key Sections & Components:
1. **Metric Overview Cards**:
   - **Order Volume**: Total number of orders placed and captured.
   - **Total Debited**: Cumulative expenditure in active currency.
   - **Payment Gateway Status**: PayPal Sandbox Orders API v2 verification stamp.
2. **Filter & Search Toolbar**:
   - Instant search input matching product titles, merchant names, or PayPal order IDs.
   - Order status tabs: `All`, `Completed`, `Pending`, `Failed`.
3. **Order Receipts Feed**:
   - Order card header: Merchant name, order placement date, and PayPal Reference ID.
   - Status badge (e.g. `Completed`).
   - Total debited amount.
   - **"Invoice" Action Button**: Opens the printable `InvoiceModal`.
   - Itemized product rows showing product thumbnail, quantity, title, and unit price.

---

### Page 6: Financial Insights (`/insights`)
**Route**: `/insights`  
**Purpose**: In-depth personal finance intelligence combining multi-month liquidity charts, category budget gauges, purchase simulation tools, and an enterprise-grade AG Grid transaction ledger.

#### Key Sections & Components:
1. **Timeframe Selector**:
   - Toggle analytics between `Last 3 Months`, `This Month`, and `YTD (Year-To-Date)`.
2. **Cash Flow Overview Wave Chart (`CashFlowChart.tsx`)**:
   - Smooth Bezier spline chart showing monthly income inflow vs total expense outflow.
   - Copilot Ideal Pacing buffer badge (*+₹4,023 Buffer*).
3. **4 Connected Summary Metrics**:
   - **Total Inflow**: Aggregated earnings across selected timeframe.
   - **Total Outflow**: Combined essential and discretionary expenditures.
   - **Net Savings Buffer**: Positive net retained funds.
   - **Savings Rate**: Percentage of income saved (e.g. `23% · Target 20% achieved`).
4. **Copilot Monthly Discretionary Runway Gauge**:
   - Visual gauge tracking current month progress against remaining safe-to-spend funds.
5. **Category Budget Progress Rows**:
   - 6 category tracking cards: Dining & Takeout, Electronics & Tech, Groceries, Streaming & Subscriptions, Fitness & Apparel, Utilities.
   - Displays spent amount, monthly limit, percentage spent, and dynamic color-coded progress bars (green, amber, or rose).
6. **Interactive Purchase Simulator (`BudgetSimulator.tsx`)**:
   - Allows users to enter an estimated item name, category, and proposed cost.
   - Calculates the exact projected discretionary runway after the simulated purchase.
   - Displays clear advice whether to proceed, postpone, or adjust categories.
7. **Transactions Ledger Workspace (`TransactionGrid.tsx` - AG Grid Community)**:
   - High-performance data table powered by AG Grid.
   - Columns: Date, Description / Item, Category, Merchant, Amount, Transaction Type (Income/Expense), Payment Status, Payment Method.
   - Sortable columns, live filtering, and checkbox multi-row selection.
   - **CSV Export Button**: Exports the filtered ledger to spreadsheet format.
8. **Ledger Summary Sidebar**:
   - Total row counter.
   - Largest single outflow recorded.
   - Active display currency.
   - **Live Selected Sum Counter**: Dynamically sums all checked rows in AG Grid to audit group expenditures.

---

### Page 7: Personalization & Memory (`/preferences`)
**Route**: `/preferences`  
**Purpose**: Transparency and control center for Morrow's AI brain, powered by the Mem0 Platform API. Inspect, add, edit, or purge memories, adjust currencies, and configure AI execution modes.

#### Key Sections & Components:
1. **User Profile Card**:
   - User avatar initials, display name, registered country, monthly baseline income, and total active memory count.
2. **Display Currency Switcher**:
   - Dropdown supporting 8 international currencies (INR ₹, USD $, EUR €, GBP £, CAD $, AUD $, JPY ¥, SGD $).
   - Instantly updates all product catalogs, financial ledgers, and calculations across the entire app.
3. **AI Response Engine Mode Switcher**:
   - **Live Gemini 3.8 / 2.0 Flash**: Calls live Google Gemini API with Mem0 context memory and Channel3 tool search.
   - **Pre-scripted Demo Mode**: Instant deterministic responses designed for predictable presentation recordings and offline demonstrations.
4. **Knowledge & Context Memory Manager**:
   - Active memory records feed.
   - Visual category badges: `Shopping Preference`, `Brand Preference`, `Financial Boundary`, `Product Interest`, `Personal Goal`.
   - Source tag: **Explicit Fact** (user stated directly) vs **Inferred Habit** (AI observed with confidence percentage).
   - In-line action controls: Edit memory content, delete single memory.
   - **Clear All Memories Button**: Complete wipe with confirmation dialog.
5. **Add / Edit Memory Modal**:
   - Form with Category selector and freeform text input to teach Morrow new rules.

---

### Page 8: Onboarding (`/onboarding`)
**Route**: `/onboarding`  
**Purpose**: First-time user setup flow to establish baseline financial parameters before entering the main dashboard.

#### Key Sections & Components:
1. Brand header with Morrow logo and tagline (*"Buy better. Spend smarter."*).
2. Clean setup form:
   - **Your Name**: Defaults to "Alex".
   - **Where are you based?**: Select country (automatically suggests local currency).
   - **Preferred Currency**: Choose display currency symbol.
   - **Monthly Take-Home Income**: Set baseline income to initialize the discretionary runway.
3. "Get Started" button routing directly to `/` with initialized store state.

---

## 5. Global Components & Interactive Modals

### Header & Global Search
- Located at the top of every screen.
- Quick navigation shortcut, active currency indicator, and "Ask Morrow" quick launcher button.
- Profile pill displaying current user name and avatar (clicking opens the `ProfileBudgetModal`).
- Log Out button (opens `LoginModal` to switch demo personas).

### Sidebar & Mobile Navigation
- Desktop sidebar featuring brand logo, primary navigation links with active indicators (Overview, Discover, Price Watch, Purchases, Financial Insights, Preferences).
- Persistent mini discretionary runway pill: *"₹17,550 safe to spend"*.
- Mobile navigation bar at the bottom for smartphones and tablets.

### Slide-Out AI Assistant ("Ask Morrow")
- Floating slide-out panel mounted in `App.tsx` (`ChatPanel.tsx`).
- Connected to Google Gemini 3.8 / 2.0 Flash via backend `/api/assistant/chat`.
- Features:
  - Multi-turn conversation persistence in local SQLite database.
  - Conversation history drawer to create new chats or switch between past sessions.
  - Quick prompt suggestion chips.
  - Contextual responses that render real interactive product cards discovered via Channel3.
  - 1-click navigation from chat product card directly to `/product/:id`.

### Login & Demo Authentication Modal (`LoginModal.tsx`)
- Appears on initial visit or when clicking "Log Out".
- Quick 1-click persona presets:
  - **Alex (India · ₹65k INR)**: Income ₹65,000, Essentials ₹32,450, Savings ₹10,000.
  - **Sarah (US · $6.5k USD)**: Income $6,500, Essentials $3,200, Savings $1,000.
  - **Custom User**: Allows defining custom income, currency, fixed expenses, and savings.
- "Start fresh with zero spend" checkbox to test initial blank-slate states.

### Profile & Budget Adjustment Modal (`ProfileBudgetModal.tsx`)
- Triggered by clicking profile name or avatar anywhere in the interface.
- Real-time adjustment form:
  - Display Name
  - Currency Selection
  - Monthly Income
  - Essential Expenses (Rent, Bills)
  - Protected Savings Commitment (SIP Reserve)
  - Safety Buffer
- Dynamic live calculation preview: computes remaining discretionary allowance as you type.
- Instant global state synchronization upon saving.

### Checkout & Affordability Guardrail Modal (`CheckoutModal.tsx`)
- Activated by clicking "Buy Now" on any product card or details page.
- **Strict Affordability Guardrail**:
  - If item price + tax exceeds available discretionary runway:
    - Displays red alert warning showing exact budget shortfall amount.
    - Purchase button is disabled.
    - Recommends creating a Price Watch to wait for a sale instead of overspending.
  - If item fits comfortably within discretionary runway:
    - Displays green approval badge showing remaining post-purchase runway.
    - Activates PayPal Sandbox checkout button.
    - On completion: debits funds from discretionary allowance, records transaction into AG Grid ledger, logs order into purchase history, and prompts to view the official invoice.

### Printable / Exportable Purchase Invoice Modal (`InvoiceModal.tsx`)
- Triggered from `/purchases` or immediately following successful checkout.
- Professional formatted invoice document:
  - Formal Invoice Number (e.g. `INV-2026-PP109283`).
  - Invoice date, status stamp, and verified merchant name.
  - Itemized table with product name, quantity, unit price, and subtotal.
  - Tax calculation breakdown (8% standard e-commerce tax).
  - Verified PayPal Sandbox capture transaction reference.
  - **Print / Save as PDF Button**: Triggers `window.print()` formatted for clean single-page printing.

### Price Watch Rule Creator Modal (`PriceWatchForm.tsx`)
- Allows configuring price tracking rules for any product.
- Controls:
  - Monitored product selector.
  - Target trigger price input.
  - Maximum total purchase limit.
  - Alert mode: **Notify Only** vs **Autonomous Sandbox Auto-Buy**.
  - Mandatory affordability constraint toggle (*"Only buy if safe within budget"*).

### Memory Record Modal
- Modal in `/preferences` to create or update explicit memories stored in Mem0.
- Category dropdown and natural text description input.

---

## 6. Backend Integrations & Agentic Architecture

### Google Gemini 3.8 / 2.0 Flash
- SDK: `@google/genai`
- Implemented in: `backend/src/services/geminiService.ts`
- Role: Serves as the cognitive companion. Gemini is initialized with strict financial system instructions:
  - Evaluates affordability using deterministic formula results.
  - Never hallucinates prices, balances, or payment captures.
  - Calls function tools to query live products and memory.
  - Formats rich markdown responses with attached product metadata.

### Mem0 Long-Term Memory Platform
- Implemented in: `backend/src/services/mem0Service.ts`
- API Endpoint: `https://api.mem0.ai/v1/memories/`
- Role: Provides persistent user memory across sessions.
  - Remembers brand loyalties (e.g. *"prefers Sony audio over Bose"*).
  - Remembers constraints (e.g. *"never spend more than ₹30,000 on gadgets"*).
  - Searches relevant memories before each Gemini response turn.

### Channel3 Live Commerce API
- Implemented in: `backend/src/services/channel3Service.ts`
- API Endpoint: `https://api.channel3.ai`
- Role: Live e-commerce search engine.
  - Retrieves real multi-merchant product offers, availability, and pricing.
  - Replaces synthetic mock products with live retail catalog data.
  - Manages price observation webhooks.

### PayPal Sandbox Orders API v2
- Implemented in: `backend/src/services/paypalService.ts`
- API Endpoint: `https://api-m.sandbox.paypal.com`
- Role: Payment processing and authorization rails.
  - Creates idempotent orders via `POST /v2/checkout/orders`.
  - Captures payment via `POST /v2/checkout/orders/{id}/capture`.
  - Generates verifiable capture IDs for purchase history and invoices.

### Prisma ORM & SQLite Database
- Implemented in: `backend/prisma/schema.prisma`
- Relational Models:
  - `DemoSession`: Auth token and session validity.
  - `Conversation` & `ConversationMessage`: Multi-turn chat persistence.
  - `Product`, `ProductOffer`, `PriceObservation`: Catalog and pricing history.
  - `PriceWatch`: Tracking rules and auto-buy parameters.
  - `Order`: Completed purchases and PayPal capture IDs.
  - `FinancialProfile`: Take-home income, fixed commitments, and savings goals.
  - `FinancialTransaction`: Complete transaction records for AG Grid.

---

## 7. Affordability Decision Matrix

Morrow calculates purchase suitability deterministically via `financialDecisionService.ts`:

| Decision State | Condition | Visual Badge | System Recommendation |
|---|---|---|---|
| **`COMFORTABLE`** | Purchase $\le 35\%$ of Discretionary Runway | 🟢 Emerald | Safe to buy immediately without impacting monthly pacing. |
| **`WITHIN_BUDGET`** | Purchase between $35\%$ and $65\%$ of Discretionary Runway | 🟢 Emerald | Fits within monthly allowance; leaves healthy remaining buffer. |
| **`BUDGET_STRAIN`** | Purchase $> 65\%$ of Discretionary Runway | 🟡 Caramel / Amber | Caution: Leaves minimal flexibility for the remainder of the month. |
| **`NOT_RECOMMENDED`** | Purchase $>$ Discretionary Runway | 🔴 Rose / Red | Over budget: Would consume protected savings or fixed essentials. |
| **`CURRENCY_MISMATCH`** | Item currency $\ne$ User financial profile currency | ⚪ Gray | Cannot verify without confirmed real-time exchange rates. |
| **`INSUFFICIENT_DATA`**| User financial profile is unconfigured | ⚪ Gray | Prompts user to complete profile setup first. |

---

## 8. Multi-Currency & Multi-Locale Support

Morrow is architected for global usability with built-in multi-currency formatting:

| Currency Code | Symbol | Locale | Default Preset Persona |
|---|---|---|---|
| **INR** | ₹ | `en-IN` | Alex (Bengaluru, India · ₹65,000/mo) |
| **USD** | $ | `en-US` | Sarah (San Francisco, USA · $6,500/mo) |
| **EUR** | € | `de-DE` | European Persona (€4,800/mo) |
| **GBP** | £ | `en-GB` | UK Persona (£4,200/mo) |
| **CAD** | $ | `en-CA` | Canadian Persona ($5,500/mo) |
| **AUD** | $ | `en-AU` | Australian Persona ($6,000/mo) |
| **JPY** | ¥ | `ja-JP` | Japanese Persona (¥450,000/mo) |
| **SGD** | $ | `en-SG` | Singapore Persona ($7,000/mo) |

Changing the currency in **Preferences** or the **Login Modal** instantly updates formatting across the entire app, including dashboard cards, spline charts, AG Grid ledger columns, and product prices.

---

## 9. Summary

Morrow redefines personal e-commerce by harmonizing desires with financial discipline. Through the combination of **Google Gemini**, **Mem0**, **Channel3**, **PayPal Sandbox**, **AG Grid**, and a **Claymorphic FinTech design system**, Morrow provides a complete, beautiful, and responsible shopping experience.

