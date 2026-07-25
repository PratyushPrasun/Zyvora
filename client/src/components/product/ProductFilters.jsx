import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Star, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useCategories } from '@/hooks/useProducts';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
];

const RATING_OPTIONS = [
  { label: '4★ & above', value: '4' },
  { label: '3★ & above', value: '3' },
  { label: '2★ & above', value: '2' },
];

// Reusable animated accordion section
const FilterSection = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/60 last:border-0 py-4 first:pt-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group"
      >
        <h4 className="text-xs font-semibold text-primary uppercase tracking-wider group-hover:text-accent transition-colors">
          {title}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-muted-light group-hover:text-accent transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductFilters = ({ filters, onFilterChange, onSearch }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      onFilterChange({
        ...filters,
        search: searchTerm,
        page: 1,
      });
    }
  };

  const handleCategoryChange = (cat) => {
    onFilterChange({
      ...filters,
      category: filters.category === cat ? '' : cat,
      page: 1,
    });
  };

  const handleRatingChange = (ratingVal) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === ratingVal ? '' : ratingVal,
      page: 1,
    });
  };

  const handleAvailabilityChange = (availVal) => {
    onFilterChange({
      ...filters,
      availability: filters.availability === availVal ? '' : availVal,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      availability: '',
      sort: 'latest',
      search: '',
      page: 1,
      limit: 12,
    });
    setMobileOpen(false);
  };

  const hasActiveFilters = Boolean(
    filters.category ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.rating ||
      filters.availability ||
      filters.search ||
      (filters.sort && filters.sort !== 'latest')
  );

  const FilterContent = () => (
    <>
      <FilterSection title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isActive = (filters.sort || 'latest') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onFilterChange({ ...filters, sort: opt.value, page: 1 });
                  if (mobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 text-accent-dark font-medium'
                    : 'text-muted hover:bg-surface hover:text-primary'
                }`}
              >
                {opt.label}
                {isActive && <Check className="w-4 h-4 text-accent" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  handleCategoryChange(cat);
                  if (mobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 text-accent-dark font-medium'
                    : 'text-muted hover:bg-surface hover:text-primary'
                }`}
              >
                {cat}
                {isActive && <Check className="w-4 h-4 text-accent" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex items-center gap-2 px-1">
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
            className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
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
            className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          />
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-1">
          {RATING_OPTIONS.map((opt) => {
            const isActive = filters.rating === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  handleRatingChange(opt.value);
                  if (mobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 text-accent-dark font-medium'
                    : 'text-muted hover:bg-surface hover:text-primary'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Star
                    className={`w-4 h-4 ${
                      isActive ? 'fill-accent text-accent' : 'fill-amber-400 text-amber-400'
                    }`}
                  />
                  {opt.label}
                </span>
                {isActive && <Check className="w-4 h-4 text-accent" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              handleAvailabilityChange('inStock');
              if (mobileOpen) setMobileOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
              filters.availability === 'inStock'
                ? 'bg-accent/10 text-accent-dark font-medium'
                : 'text-muted hover:bg-surface hover:text-primary'
            }`}
          >
            In Stock Only
            {filters.availability === 'inStock' && <Check className="w-4 h-4 text-accent" />}
          </button>
        </div>
      </FilterSection>
    </>
  );

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-6 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light group-focus-within:text-accent transition-colors duration-200" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-border/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300 hover:border-border-dark shadow-sm input-focus-glow"
        />
      </form>

      {/* Desktop Filters (Card pattern) */}
      <div className="hidden lg:block bg-white rounded-3xl border border-border/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/60">
          <h3 className="font-display font-semibold text-lg flex items-center gap-2 text-primary">
            <SlidersHorizontal className="w-5 h-5 text-accent" />
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted hover:text-error transition-colors font-medium flex items-center gap-1 bg-surface px-2 py-1 rounded-md"
            >
              <X className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>
        
        <div className="space-y-1">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => setMobileOpen(true)}
          className="mb-4 bg-white border-border/80 shadow-sm relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter & Sort
          {hasActiveFilters && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent animate-pulse" />
          )}
        </Button>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setMobileOpen(false)}
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
              >
                {/* Drag Handle & Header */}
                <div className="p-4 border-b border-border/60 flex items-center justify-between bg-white relative z-10 shrink-0">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-border-dark" />
                  <h3 className="font-display font-semibold text-lg pt-2 text-primary">Filters</h3>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 bg-surface hover:bg-surface-dark rounded-full transition-colors mt-2"
                  >
                    <X className="w-5 h-5 text-muted" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5">
                  <FilterContent />
                </div>

                {/* Action Footer */}
                <div className="p-4 border-t border-border/60 bg-surface flex items-center gap-3 shrink-0 pb-safe">
                  <Button variant="outline" fullWidth onClick={clearFilters} disabled={!hasActiveFilters}>
                    Clear
                  </Button>
                  <Button variant="glow" fullWidth onClick={() => setMobileOpen(false)}>
                    Show Results
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductFilters;
