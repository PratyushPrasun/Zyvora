import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAllOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const statusVariant = {
  Pending: 'warning',
  Confirmed: 'info',
  Packed: 'info',
  Shipped: 'accent',
  Delivered: 'success',
  Cancelled: 'error',
};

const format = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(val);

const AdminOrders = () => {
  const { data, isLoading, isError, refetch } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState('All');

  const orders = data?.orders || [];
  const filtered =
    filter === 'All'
      ? orders
      : orders.filter((o) => o.orderStatus === filter);

  return (
    <>
      <Helmet>
        <title>Orders — Admin — Zyvora</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
            Orders <span className="text-muted font-light text-2xl">({data?.count || 0})</span>
          </h1>
          <p className="text-muted mt-2">View and manage customer orders.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3">
          {['All', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === status
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-muted border border-border/60 hover:border-primary/30 hover:text-primary shadow-sm'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl p-6 border border-border/60">
            <Skeleton.Table rows={5} cols={5} />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-border/60 text-center">
            <EmptyState
              icon={ShoppingCart}
              title="No orders found"
              description={
                filter !== 'All'
                  ? `No ${filter.toLowerCase()} orders match this filter.`
                  : 'No orders have been placed yet.'
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-surface/50">
                    <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">
                      Order
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">
                      Payment
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-primary uppercase tracking-wider text-xs">
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-border/40 last:border-0 hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-primary">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-primary">
                          {order.user?.name}
                        </p>
                        <p className="text-xs text-muted font-medium">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">
                        {format(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            order.paymentStatus === 'Paid'
                              ? 'success'
                              : 'warning'
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant[order.orderStatus]}>
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            updateStatus.mutate({
                              id: order._id,
                              orderStatus: e.target.value,
                            })
                          }
                          className="text-sm font-medium border border-border/60 rounded-xl px-3 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 bg-white cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
