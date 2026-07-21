import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm hover:border-accent/30 transition-colors"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <p className="text-3xl font-display font-bold text-primary mb-1">{value}</p>
    <p className="text-sm font-medium text-muted uppercase tracking-wider">{label}</p>
  </motion.div>
);

const format = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(val);

const AdminDashboard = () => {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <div className="p-8"><Skeleton.Table rows={4} cols={4} /></div>;
  if (isError) return <ErrorState onRetry={refetch} />;

  const { summary, orders, inventory, sales, recentOrders, topSellingProducts } =
    data;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — Zyvora</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">Overview</h1>
          <p className="text-muted mt-2">Welcome back to the command center.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={format(summary.totalRevenue)}
            color="bg-accent/10 text-accent"
            delay={0}
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={summary.totalOrders}
            color="bg-primary/10 text-primary"
            delay={0.1}
          />
          <StatCard
            icon={Package}
            label="Total Products"
            value={summary.totalProducts}
            color="bg-purple-50 text-purple-600"
            delay={0.2}
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={summary.totalUsers}
            color="bg-info/10 text-info"
            delay={0.3}
          />
        </div>

        {/* Sales Today & Month */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm font-semibold text-muted uppercase tracking-wider">Today's Revenue</span>
            </div>
            <p className="text-2xl font-bold text-primary">{format(sales.todayRevenue)}</p>
          </div>
          <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm font-semibold text-muted uppercase tracking-wider">This Month</span>
            </div>
            <p className="text-2xl font-bold text-primary">{format(sales.thisMonthRevenue)}</p>
          </div>
          <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <span className="text-sm font-semibold text-muted uppercase tracking-wider">Stock Alerts</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-bold text-warning">{inventory.lowStockProducts}</span>
                <span className="text-sm text-muted ml-2">Low</span>
              </div>
              <div className="w-px h-6 bg-border/60" />
              <div>
                <span className="text-2xl font-bold text-error">{inventory.outOfStockProducts}</span>
                <span className="text-sm text-muted ml-2">Out</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-display font-semibold text-primary mb-6">Order Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(orders).map(([status, count]) => (
              <div key={status} className="text-center p-4 rounded-2xl bg-surface border border-border/40">
                <p className="text-2xl font-display font-bold text-primary mb-1">{count}</p>
                <p className="text-xs font-medium text-muted uppercase tracking-wider">{status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold text-primary">Recent Orders</h3>
              <span className="text-sm font-medium text-accent hover:underline cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {recentOrders?.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border/40 hover:border-accent/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <ShoppingCart className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted">{order.user?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary mb-1">{format(order.totalAmount)}</p>
                    <Badge
                      variant={
                        order.orderStatus === 'Delivered'
                          ? 'success'
                          : order.orderStatus === 'Cancelled'
                          ? 'error'
                          : 'accent'
                      }
                    >
                      {order.orderStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling */}
          <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-display font-semibold text-primary mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {topSellingProducts?.map((prod, i) => (
                <div
                  key={prod.productId}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/40 hover:border-accent/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-sm font-bold text-accent shrink-0">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 shadow-sm border border-border/40">
                    {prod.image && (
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary line-clamp-1">
                      {prod.title}
                    </p>
                    <p className="text-xs text-muted">{prod.totalSold} units sold</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{format(prod.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
