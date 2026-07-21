import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { useState } from 'react';

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useProducts({ page, limit: 10 });
  const deleteProduct = useDeleteProduct();

  const products = data?.products || [];

  const format = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <>
      <Helmet>
        <title>Products — Admin — Zyvora</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">Products</h1>
            <p className="text-muted mt-2">Manage your inventory and catalog.</p>
          </div>
          <Link to="/admin/products/new">
            <Button size="md" variant="glow">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl p-6 border border-border/60">
            <Skeleton.Table rows={5} cols={5} />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-border/60 text-center">
            <EmptyState
              icon={Package}
              title="No products yet"
              description="Start by adding your first product."
            />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-border/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface/50">
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">Product</th>
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">Category</th>
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">Price</th>
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">Stock</th>
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">Status</th>
                      <th className="text-right px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-border/40 last:border-0 hover:bg-surface/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-surface border border-border/40 overflow-hidden shrink-0">
                              {product.images?.[0]?.url && (
                                <img
                                  src={product.images[0].url}
                                  alt=""
                                  className="w-full h-full object-cover mix-blend-multiply"
                                />
                              )}
                            </div>
                            <span className="font-semibold text-primary line-clamp-1 max-w-[200px]">
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted font-medium">{product.category}</td>
                        <td className="px-6 py-4 font-bold text-primary">{format(product.price)}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              product.stock === 0
                                ? 'error'
                                : product.stock <= 5
                                ? 'warning'
                                : 'success'
                            }
                          >
                            {product.stock}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={product.isActive ? 'accent' : 'default'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm('Delete this product?')) {
                                  deleteProduct.mutate(product._id);
                                }
                              }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data.totalPages > 1 && (
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
