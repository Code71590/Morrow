# Morrow — AI-Powered Smart Shopping & Personal Finance Companion

> **Buy better. Spend smarter.**  
> Morrow bridges the gap between e-commerce desire and personal financial discipline by calculating your real-time discretionary runway before you buy.

---

## 🌟 Overview

Modern online shopping makes spending frictionless, often leading to buyer's remorse and derailed savings goals. **Morrow** is designed as a calm, intelligent companion that keeps your discretionary budget front and center.

Instead of generic budgeting apps or predatory "Buy Now Pay Later" schemes, Morrow calculates your **true discretionary runway**:
$$\text{Discretionary Allowance} = \text{Monthly Income} - \text{Fixed Expenses} - \text{Protected Savings} - \text{Safety Buffer}$$

Every product search, curated recommendation, and price watch is evaluated in real time against your remaining budget for the month.

---

## 🎨 Design Inspiration & Visual Aesthetic

Morrow's home dashboard is inspired by modern, warm-minimalist FinTech design:
- **Warm Sand & Cream Palette**: Built on warm, soothing undertones (`#F6F3EC` canvas, `#FAF7F2` cards, `#EADDCF` borders, `#C89B67` golden amber, and `#DE873E` caramel accents).
- **Claymorphic Elevation**: Soft, diffused shadows (`rgba(180, 150, 120, 0.12)`) and generous radii (`rounded-[18px]` to `rounded-[24px]`).
- **4-Card Hero Metric Row**:
  1. **Available Discretionary**: Real-time runway with pace indicator (e.g. `₹17,550` · *₹4,023 ahead of ideal pace*).
  2. **Monthly Income**: Baseline take-home income (e.g. `₹65,000` · *Salary Credit Active*).
  3. **Fixed Expenses**: Essential commitments (e.g. `₹32,450` · *Rent, utilities & groceries*).
  4. **Savings Goal**: Protected savings with an integrated caramel progress bar (e.g. `₹10,000 (65%)` achieved).
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
  - Emergency Buffer
- **Live Recalculation**: Instant recalculation across all dashboard cards, pacing gauges, and charts without reloading.
- **Demo Login & Logout**:
  - Full demo authentication flow with quick presets (**Alex · India ₹65k**, **Sarah · US $6.5k**, or Custom).
  - Quick Log Out button in header and sidebar to test multiple user journeys.

### 2. Copilot Money Pacing & Runway Gauge
- Real-time month-progress tracking (e.g. *Day 12 of 30 · 40% elapsed*).
- Visual pace gauge with ideal-pace marker indicating whether you are ahead or behind your planned monthly spending rate.

### 3. Natural-Language Product Search
- Search for products using conversational language (e.g., *"noise-cancelling headphones under ₹25,000"*, *"a laptop for programming"*).
- Instant budget compatibility check on search results.

### 4. Curated Recommendations & Affordability Badges
- Personalized product catalog (Sony XM5, AirPods Pro, Logitech MX Master 3S, etc.).
- Real-time budget fit evaluation:
  - 🟢 **Safe to Buy**: Fits comfortably within current discretionary runway.
  - 🟡 **Pushes Budget**: Exceeds monthly allowance but reachable with pacing adjustments.
  - 🔴 **Wait for Sale**: Highly impactful purchase; recommended to track target price.

### 5. Active Price Watches with Sparklines
- Track target prices for wishlisted items.
- Live price history sparklines and visual price drop indicators.

### 6. Simulated Sandbox Checkout
- Simulated checkout with PayPal sandbox status.
- Deducts order amount from discretionary allowance and logs transaction into purchase history.

### 7. "Ask Morrow" AI Shopping Assistant
- Slide-out assistant powered by conversational shopping and financial memory.
- Provides context-aware purchase advice, product comparisons, and affordability guidance.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework & Language** | React 19, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS v4, Custom Design Tokens (`DM Sans`, `Inter`) |
| **Icons & Visuals** | Lucide React, Custom SVG Spline Bezier Charts, Sparklines |
| **State Management** | Zustand (with local persistence) |
| **Data & Tables** | AG Grid Community / AG Charts |
| **Payments** | PayPal JS SDK integration |

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/)

### Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build
```bash
npm run build
```
