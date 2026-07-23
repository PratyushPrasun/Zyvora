import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { useAllOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
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

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Packed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Shipped: 'bg-teal-50 text-teal-700 border-teal-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const format = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(val || 0);

const AdminOrders = () => {
  const { data, isLoading, isError, refetch } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const orders = data?.orders || [];
  const filtered = orders.filter((o) => {
    const matchesFilter = filter === 'All' || o.orderStatus === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      o._id.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Orders Telemetry — Admin — Zyvora OS</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              Orders Management
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {orders.length} Total
              </span>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Live customer orders processing and status dispatch.
            </p>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {['All', ...STATUS_OPTIONS].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filter === status
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order #, customer name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Showing {filtered.length} matching orders</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
            <Skeleton.Table rows={5} cols={5} />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-2xs">
            <EmptyState
              icon={ShoppingCart}
              title="No orders found"
              description={
                filter !== 'All'
                  ? `No ${filter.toLowerCase()} orders match this criteria.`
                  : 'No customer orders placed yet.'
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold sticky top-0">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Pipeline Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Update Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-emerald-700 text-xs">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 text-xs">
                          {order.user?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-slate-500">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                        {format(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            statusStyles[order.orderStatus] ||
                            'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            updateStatus.mutate({
                              id: order._id,
                              orderStatus: e.target.value,
                            })
                          }
                          className="text-xs font-medium bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-white text-slate-900">
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
