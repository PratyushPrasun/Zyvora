import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useProducts } from '@/hooks/useProducts';
import { Search } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'latest',
  };

  const { data, isLoading, isError, refetch } = useProducts(filters);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val !== '' && key !== 'limit') params.set(key, val);
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

  return (
    <>
      <Helmet>
        <title>Shop — Zyvora</title>
        <meta name="description" content="Browse our curated collection of premium products." />
      </Helmet>

      <div className="bg-surface min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-border/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          
          <Container className="py-12 relative z-10">
            <Breadcrumb items={[{ label: 'Shop' }]} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mt-6 tracking-tight">
                {filters.search
                  ? `Results for "${filters.search}"`
                  : filters.category || 'All Products'}
              </h1>
              {data && (
                <p className="text-muted mt-3 text-lg font-light">
                  Showing <span className="font-medium text-primary">{data.products?.length || 0}</span> of{' '}
                  <span className="font-medium text-primary">{data.totalProducts}</span> products
                </p>
              )}
            </motion.div>
          </Container>
        </div>

        <Container className="py-12">
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
                  action={() => updateFilters({ page: 1, limit: 12 })}
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
