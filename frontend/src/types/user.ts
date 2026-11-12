export type CurrencyCode = 'USD' | 'INR' | 'GBP' | 'EUR' | 'AED' | 'SGD' | 'AUD' | 'CAD';

export interface LocaleConfig {
  currency: CurrencyCode;
  locale: string;
  country: string;
  countryCode: string;
}

export const LOCALE_MAP: Record<CurrencyCode, string> = {
  USD: 'en-US', INR: 'en-IN', GBP: 'en-GB', EUR: 'de-DE',
  AED: 'ar-AE', SGD: 'en-SG', AUD: 'en-AU', CAD: 'en-CA',
};

export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  'United States': 'USD', 'India': 'INR', 'United Kingdom': 'GBP',
  'European Union': 'EUR', 'UAE': 'AED', 'Singapore': 'SGD',
  'Australia': 'AUD', 'Canada': 'CAD',
};

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  USD: 'USD — US Dollar', INR: 'INR — Indian Rupee', GBP: 'GBP — British Pound',
  EUR: 'EUR — Euro', AED: 'AED — UAE Dirham', SGD: 'SGD — Singapore Dollar',
  AUD: 'AUD — Australian Dollar', CAD: 'CAD — Canadian Dollar',
};

export interface UserProfile {
  id: string;
  displayName: string;
  currency: CurrencyCode;
  country: string;
  monthlyIncome: number;
  hasCompletedOnboarding: boolean;
  createdAt: string;
}

export interface UserPreference {
  id: string;
  type: 'brand' | 'category' | 'priceRange' | 'style' | 'merchant';
  value: string;
  label: string;
  createdAt: string;
}
