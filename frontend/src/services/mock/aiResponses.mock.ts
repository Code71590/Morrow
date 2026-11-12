export interface MockResponse {
  delay: number;
  text: string;
  action?: 'show_products' | 'show_financial' | 'show_price_watch' | 'show_affordability' | 'show_memory';
}

const SCRIPTS: Record<string, MockResponse> = {
  headphones: {
    delay: 800,
    text: "I found some excellent options for wireless travel headphones. Based on your preference for Sony products and noise cancellation, I recommend the **Sony WH-1000XM5** at **₹24,990** — it has 30-hour battery life and industry-leading ANC. The **Anker Soundcore Q45** at **₹4,999** is a great budget alternative. Would you like me to compare them side by side, or add the Sony to your price watch?",
    action: 'show_products',
  },
  laptop: {
    delay: 900,
    text: "I see you're eyeing the **Samsung Galaxy Book 4 Pro** at **₹1,19,990**. Let me check your finances... Your discretionary runway this month is **₹17,550**, so this purchase would exceed your current monthly allowance. Your November spending is on track. I'd suggest planning for a structured SIP/savings allocation or setting a price watch — it dropped to ₹1,19,990 from ₹1,29,990 last month.",
    action: 'show_affordability',
  },
  track: {
    delay: 600,
    text: "Done! I've set up a price watch for this product. I'll alert you when it hits your target trigger in INR. You can configure auto-buy rules, seller requirements, and notification preferences from the **Price Watch** page.",
    action: 'show_price_watch',
  },
  budget: {
    delay: 700,
    text: "Here's your financial snapshot: Monthly take-home income **₹65,000**. After apartment rent (₹20,000), essentials (₹12,450), protected savings (₹10,000), and commitments (₹5,000), your **available discretionary budget is ₹17,550**. You're pacing **₹2,800 ahead of ideal pace** this month.",
    action: 'show_financial',
  },
  spend: {
    delay: 700,
    text: "In November so far, your recorded outflow is **₹32,450** — including rent (₹20,000) plus ₹8,995 for the Logitech MX Master 3S and ₹3,850 for groceries. Last month (October) total spend was **₹34,200**, with the Sony headphones purchase being the largest item. Your 3-month savings rate remains strong at **50%**.",
    action: 'show_financial',
  },
  buy: {
    delay: 800,
    text: "I can help you purchase that! Let me check your budget first... Based on your current discretionary balance of **₹17,550**, I'll confirm affordability before proceeding. Would you like me to initiate the **PayPal Sandbox checkout**, or would you prefer to set up a price watch instead?",
    action: 'show_affordability',
  },
  memory: {
    delay: 600,
    text: "I remember that last month you looked at the **Samsung Galaxy Book 4 Pro** (~₹1,19,990) and postponed it to keep your emergency fund SIP protected. You also prefer Sony and Apple for audio devices, and value long battery life for commute comfort. Want me to check for price drops, or pull up your full memory profile?",
    action: 'show_memory',
  },
  default: {
    delay: 500,
    text: "I'm **Morrow**, your personal shopping companion. I help you discover products, verify budget fit with Indian rupee conventions, track prices across merchants, and remember your previous shopping decisions. What would you like to explore today?",
  },
};

export function matchScript(message: string): MockResponse {
  const m = message.toLowerCase();
  if (m.includes('headphone') || m.includes('earphone') || m.includes('earbud') || m.includes('audio') || m.includes('speaker')) return SCRIPTS.headphones;
  if (m.includes('laptop') || m.includes('galaxy book') || m.includes('macbook') || m.includes('computer')) return SCRIPTS.laptop;
  if (m.includes('track') || m.includes('watch') || m.includes('price drop') || m.includes('alert') || m.includes('monitor')) return SCRIPTS.track;
  if (m.includes('spent') || m.includes('cost') || m.includes('expense') || m.includes('how much')) return SCRIPTS.spend;
  if (m.includes('budget') || m.includes('afford') || m.includes('financ') || m.includes('money') || m.includes('saving')) return SCRIPTS.budget;
  if (m.includes('buy') || m.includes('purchase') || m.includes('checkout') || m.includes('order')) return SCRIPTS.buy;
  if (m.includes('remember') || m.includes('memory') || m.includes('last time') || m.includes('previous') || m.includes('before') || m.includes('history')) return SCRIPTS.memory;
  return SCRIPTS.default;
}
