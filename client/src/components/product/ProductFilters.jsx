import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Sports',
  'Books',
  'Accessories',
  'Footwear',
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
];

const ProductFilters = ({ filters, onFilterChange, onSearch }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (cat) => {
    onFilterChange({
      ...filters,
      category: filters.category === cat ? '' : cat,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({ page: 1, limit: 12 });
    onSearch('');
  };

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-6 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light group-focus-within:text-accent transition-colors duration-200" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300 hover:border-border-dark"
        />
      </form>

      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-6">
        {/* Sort */}
        <div>
          <h4 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Sort By</h4>
          <div className="space-y-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  onFilterChange({ ...filters, sort: opt.value, page: 1 })
                }
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  filters.sort === opt.value
                    ? 'bg-accent text-white shadow-sm shadow-accent/20'
                    : 'text-muted hover:bg-surface-dark hover:text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Category</h4>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  filters.category === cat
                    ? 'bg-accent text-white shadow-sm shadow-accent/20'
                    : 'text-muted hover:bg-surface-dark hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Price Range</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minPrice: e.target.value,
                  page: 1,
                })
              }
              className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
            />
            <span className="text-muted-light text-sm">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  maxPrice: e.target.value,
                  page: 1,
                })
              }
              className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" fullWidth onClick={clearFilters}>
            <X className="w-3.5 h-3.5" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mb-4"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {hasActiveFilters ? '•' : ''}
        </Button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white rounded-2xl border border-border/50 space-y-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        onFilterChange({ ...filters, sort: opt.value, page: 1 })
                      }
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                        filters.sort === opt.value
                          ? 'bg-accent text-white shadow-sm shadow-accent/20'
                          : 'bg-surface text-muted border border-border hover:border-accent/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                        filters.category === cat
                          ? 'bg-accent text-white shadow-sm shadow-accent/20'
                          : 'bg-surface text-muted border border-border hover:border-accent/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductFilters;
