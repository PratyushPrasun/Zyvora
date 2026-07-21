import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { useMyOrders } from '@/hooks/useOrders';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';

const statusVariant = {
  Pending: 'warning',
  Confirmed: 'info',
  Packed: 'info',
  Shipped: 'accent',
  Delivered: 'success',
  Cancelled: 'error',
};

const Orders = () => {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const orders = data?.orders || [];

  return (
    <>
      <Helmet>
        <title>My Orders — Zyvora</title>
      </Helmet>

      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-8 tracking-tight">
          My Orders
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border/60 p-12 shadow-sm text-center">
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="When you place an order, it will appear here."
              action={() => (window.location.href = '/shop')}
              actionLabel="Start Shopping"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/account/orders/${order._id}`}
                className="block bg-white rounded-3xl border border-border/60 p-6 hover:border-accent/40 hover:shadow-md hover:shadow-black/[0.02] transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                      <Package className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-primary mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-medium text-muted flex items-center gap-1.5 bg-surface-dark px-2 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/60">
                    <Badge variant={statusVariant[order.orderStatus] || 'default'}>
                      {order.orderStatus}
                    </Badge>
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/40">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-xl bg-surface border border-border/40 overflow-hidden"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      )}
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border/40 flex items-center justify-center">
                      <span className="text-xs font-medium text-muted">
                        +{order.items.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
