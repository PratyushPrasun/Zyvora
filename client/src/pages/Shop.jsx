import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/Container';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useProducts } from '@/hooks/useProducts';
import { Search, X } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    availability: searchParams.get('availability') || '',
    sort: searchParams.get('sort') || 'latest',
  };

  const { data, isLoading, isError, refetch } = useProducts(filters);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (
        val !== undefined &&
        val !== null &&
        val !== '' &&
        key !== 'limit' &&
        !(key === 'sort' && val === 'latest') &&
        !(key === 'page' && Number(val) === 1)
      ) {
        params.set(key, val);
      }
    });
    setSearchParams(params);
  };

  const handleSearch = (term) => {
    updateFilters({ ...filters, search: term, page: 1 });
  };

  const handlePageChange = (page) => {
    updateFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAll = () => {
    updateFilters({
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
  };

  // Build active filter chips
  const activeChips = [];
  if (filters.category) activeChips.push({ key: 'category', label: filters.category });
  if (filters.search) activeChips.push({ key: 'search', label: `"${filters.search}"` });
  if (filters.rating) activeChips.push({ key: 'rating', label: `${filters.rating}★+` });
  if (filters.availability) activeChips.push({ key: 'availability', label: 'In Stock' });
  if (filters.minPrice || filters.maxPrice) {
    activeChips.push({
      key: 'price',
      label: `₹${filters.minPrice || '0'} – ₹${filters.maxPrice || '∞'}`,
    });
  }

  const removeChip = (chipKey) => {
    const updated = { ...filters, page: 1 };
    if (chipKey === 'price') {
      updated.minPrice = '';
      updated.maxPrice = '';
    } else {
      updated[chipKey] = '';
    }
    updateFilters(updated);
  };

  return (
    <>
      <Helmet>
        <title>Shop — Zyvora</title>
        <meta name="description" content="Browse our curated collection of premium products." />
      </Helmet>

      <div className="bg-surface min-h-screen">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-glow" />

          <Container className="page-header-content">
            <Breadcrumb items={[{ label: 'Shop' }]} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="page-header-title">
                {filters.search
                  ? `Results for "${filters.search}"`
                  : filters.category || 'All Products'}
              </h1>
              {data && (
                <motion.p
                  key={data.totalProducts}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="page-header-subtitle"
                >
                  Showing <span className="font-medium text-primary">{data.products?.length || 0}</span> of{' '}
                  <span className="font-medium text-primary">{data.totalProducts}</span> products
                </motion.p>
              )}
            </motion.div>
          </Container>
        </div>

        <Container className="py-12">
          {/* Active filter chips */}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-2 mb-8 overflow-hidden"
              >
                <span className="text-xs font-medium text-muted mr-1">Active filters:</span>
                {activeChips.map((chip) => (
                  <motion.button
                    key={chip.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => removeChip(chip.key)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent-dark text-xs font-medium border border-accent/20 hover:bg-accent/15 transition-colors"
                  >
                    {chip.label}
                    <X className="w-3 h-3" />
                  </motion.button>
                ))}
                <button
                  onClick={handleClearAll}
                  className="text-xs text-muted hover:text-primary transition-colors underline underline-offset-2"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24">
                <ProductFilters
                  filters={filters}
                  onFilterChange={updateFilters}
                  onSearch={handleSearch}
                />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {isError ? (
                <ErrorState onRetry={refetch} />
              ) : data?.products?.length === 0 && !isLoading ? (
                <EmptyState
                  icon={Search}
                  title="No products found"
                  description="Try adjusting your filters or search term to find what you're looking for."
                  action={handleClearAll}
                  actionLabel="Clear Filters"
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductGrid
                    products={data?.products || []}
                    loading={isLoading}
                    columns={3}
                  />

                  {data && data.totalPages > 1 && (
                    <div className="mt-16 border-t border-border/60 pt-10">
                      <Pagination
                        currentPage={data.currentPage}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Shop;
