import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { MorrowLogo } from '@/components/common/MorrowLogo';
import type { CurrencyCode } from '@/types/user';
import { COUNTRY_CURRENCY_MAP, CURRENCY_LABELS } from '@/types/user';

const COUNTRIES = Object.keys(COUNTRY_CURRENCY_MAP);

export function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAppStore();

  const [name, setName] = useState('Alex');
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [income, setIncome] = useState('65000');
  const [isLoading, setIsLoading] = useState(false);

  const handleCountryChange = (c: string) => {
    setCountry(c);
    const curr = COUNTRY_CURRENCY_MAP[c];
    if (curr) setCurrency(curr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    completeOnboarding(name.trim(), currency, country, parseFloat(income) || 65000);
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#192923] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3.5 mb-8 justify-center sm:justify-start">
          <div className="w-12 h-12 flex items-center justify-center">
            <MorrowLogo className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white font-heading tracking-tight">Morrow</h1>
            <p className="text-xs text-white/60">Buy better. Spend smarter.</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[16px] p-6 lg:p-8 shadow-2xl border border-[#E9E6DE]">
          <h2 className="text-2xl font-bold font-heading text-[#192923] mb-1">Welcome to Morrow</h2>
          <p className="text-xs text-[#858A83] mb-6 leading-relaxed">
            Configure your local currency and discretionary runway so Morrow can evaluate purchases accurately.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Name"
              placeholder="Alex"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242C27]/70 mb-1.5">
                Where are you based?
              </label>
              <select
                value={country}
                onChange={e => handleCountryChange(e.target.value)}
                className="w-full h-11 px-4 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[10px] text-sm text-[#242C27] focus:outline-none focus:border-[#192923]"
              >
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242C27]/70 mb-1.5">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="w-full h-11 px-4 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[10px] text-sm text-[#242C27] focus:outline-none focus:border-[#192923]"
              >
                {Object.entries(CURRENCY_LABELS).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>

            <Input
              label="Monthly Take-Home Income (₹)"
              type="number"
              placeholder="65000"
              value={income}
              onChange={e => setIncome(e.target.value)}
              required
              min="0"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={16} />}
                className="w-full font-bold"
              >
                Start Exploring
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
