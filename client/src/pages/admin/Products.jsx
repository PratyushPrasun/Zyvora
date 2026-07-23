import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package, Search, Tag } from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useProducts({ page, limit: 10, search });
  const deleteProduct = useDeleteProduct();

  const products = data?.products || [];

  const format = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(val || 0);

  return (
    <>
      <Helmet>
        <title>Products — Admin — Zyvora OS</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Products Catalog
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Manage inventory, pricing, and live catalog items.
            </p>
          </div>
          <Link to="/admin/products/new">
            <Button size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Showing {products.length} products</span>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
            <Skeleton.Table rows={5} cols={5} />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-2xs">
            <EmptyState
              icon={Package}
              title="No products found"
              description="Try adjusting your search query or add a new product."
            />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold sticky top-0">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock Telemetry</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              {product.images?.[0]?.url && (
                                <img
                                  src={product.images[0].url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <span className="font-semibold text-slate-900 line-clamp-1 max-w-[220px]">
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700">
                          {format(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              product.stock === 0
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : product.stock <= 5
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              product.isActive !== false
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {product.isActive !== false ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${product.title}"?`)) {
                                  deleteProduct.mutate(product._id);
                                }
                              }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data?.totalPages > 1 && (
              <div className="flex justify-center pt-6">
                <Pagination
                  currentPage={data.currentPage}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminProducts;
