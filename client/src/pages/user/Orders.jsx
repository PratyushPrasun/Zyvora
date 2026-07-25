import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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

const filterTabs = ['All', 'Pending', 'Delivered', 'Cancelled'];

const Orders = () => {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const orders = data?.orders || [];
  
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return ['Pending', 'Confirmed', 'Packed', 'Shipped'].includes(order.orderStatus);
    return order.orderStatus === activeFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <>
      <Helmet>
        <title>My Orders — Zyvora</title>
      </Helmet>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
              Order History
            </h1>
            <p className="text-muted mt-2 text-sm">View and track your recent purchases</p>
          </div>

          {/* Filter Pills */}
          {!isLoading && !isError && orders.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap relative ${
                    activeFilter === tab
                      ? 'text-accent-dark'
                      : 'text-muted hover:text-primary bg-white border border-border/60 hover:bg-surface'
                  }`}
                >
                  {activeFilter === tab && (
                    <motion.div
                      layoutId="orderFilter"
                      className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-xl"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton.OrderCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border/60 p-12 shadow-sm text-center min-h-[400px] flex items-center justify-center">
            <EmptyState
              icon={Package}
              title="No orders found"
              description="You haven't placed any orders yet. Discover our latest collections."
              action={() => (window.location.href = '/shop')}
              actionLabel="Start Shopping"
            />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border/60 p-12 shadow-sm text-center">
            <EmptyState
              icon={Filter}
              title={`No ${activeFilter.toLowerCase()} orders`}
              description="You don't have any orders matching this status."
              action={() => setActiveFilter('All')}
              actionLabel="Clear Filter"
            />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => (
                <motion.div key={order._id} variants={itemVariants} layout>
                  <Link
                    to={`/account/orders/${order._id}`}
                    className="block bg-white rounded-3xl border border-border/60 p-6 hover:border-accent/40 hover:shadow-lg hover:shadow-black/[0.03] hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-surface border border-border/40 flex items-center justify-center shrink-0 group-hover:bg-accent/5 group-hover:border-accent/20 transition-all duration-300">
                          <Package className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-primary mb-1">
                            Order <span className="font-mono text-muted-light group-hover:text-primary transition-colors">#{order._id.slice(-8).toUpperCase()}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-medium text-muted flex items-center gap-1.5 bg-surface-dark px-2.5 py-1 rounded-md border border-border/60">
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
                        <Badge variant={statusVariant[order.orderStatus] || 'default'} dot>
                          {order.orderStatus}
                        </Badge>
                        <div className="w-10 h-10 rounded-xl bg-surface border border-border/40 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300">
                          <ChevronRight className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/40">
                      {order.items?.slice(0, 4).map((item, i) => (
                        <div
                          key={i}
                          className="w-14 h-14 rounded-xl bg-surface border border-border/60 overflow-hidden group-hover:border-accent/20 transition-colors"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover mix-blend-multiply"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-dark">
                              <Package className="w-5 h-5 text-muted-light" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="w-14 h-14 rounded-xl bg-surface border border-border/60 flex items-center justify-center">
                          <span className="text-xs font-bold text-muted">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Orders;
