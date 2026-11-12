import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { SearchFilters } from '@/types/product';

export interface ProductSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading?: boolean;
  initialQuery?: string;
}

const CATEGORIES = ['All', 'Electronics', 'Computers', 'Peripherals', 'Wearables'];
const PRICE_PRESETS = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under ₹10,000', min: undefined, max: 10000 },
  { label: '₹10,000 to ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 to ₹75,000', min: 25000, max: 75000 },
  { label: 'Over ₹75,000', min: 75000, max: undefined },
];

export function ProductSearch({ onSearch, isLoading, initialQuery = '' }: ProductSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPricePreset, setSelectedPricePreset] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = PRICE_PRESETS[selectedPricePreset];
    onSearch(query, {
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      minPrice: preset.min,
      maxPrice: preset.max,
    });
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const preset = PRICE_PRESETS[selectedPricePreset];
    onSearch(query, {
      category: cat === 'All' ? undefined : cat,
      minPrice: preset.min,
      maxPrice: preset.max,
    });
  };

  const handlePriceClick = (idx: number) => {
    setSelectedPricePreset(idx);
    const preset = PRICE_PRESETS[idx];
    onSearch(query, {
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      minPrice: preset.min,
      maxPrice: preset.max,
    });
  };

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#858A83]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or describe requirements (e.g. 'headphones for travel')..."
            className="w-full h-12 pl-11 pr-10 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[10px] text-sm text-[#242C27] placeholder:text-[#858A83] focus:outline-none focus:border-[#192923] focus:ring-2 focus:ring-[#192923]/10 shadow-xs transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onSearch('', {
                  category: selectedCategory === 'All' ? undefined : selectedCategory,
                });
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#858A83] hover:text-[#242C27] p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="px-6 h-12 font-semibold text-sm"
        >
          Find products
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-12 px-4 ${showFilters ? 'bg-[#E9E6DE] border-[#192923]' : ''}`}
          title="Toggle Price Filter"
        >
          <SlidersHorizontal size={17} />
        </Button>
      </form>

      {/* Compact Categories & Price Filter Toolbar */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#192923] text-white shadow-xs'
                  : 'bg-[#F6F4EE] text-[#242C27]/75 hover:text-[#242C27] hover:bg-[#E9E6DE] border border-[#E9E6DE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Presets */}
        <div className="hidden md:flex items-center gap-1">
          {PRICE_PRESETS.map((preset, idx) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePriceClick(idx)}
              className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-all cursor-pointer ${
                selectedPricePreset === idx
                  ? 'bg-[#303933] text-white'
                  : 'text-[#858A83] hover:text-[#242C27]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Filters Drawer (Mobile) */}
      {showFilters && (
        <div className="md:hidden p-3.5 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[10px] space-y-2 animate-in fade-in duration-150">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#858A83] block">Price Filter</span>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map((preset, idx) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePriceClick(idx)}
                className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
                  selectedPricePreset === idx
                    ? 'bg-[#192923] text-white'
                    : 'bg-white border border-[#E9E6DE] text-[#242C27]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
