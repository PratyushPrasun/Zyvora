import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, trend, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-500/40 hover:shadow-sm transition-all group relative overflow-hidden"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-display font-bold text-slate-900 mb-1 tracking-tight">{value}</p>
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
  </motion.div>
);

const format = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(val || 0);

const AdminDashboard = () => {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading)
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <Skeleton.Table rows={4} cols={4} />
      </div>
    );
  if (isError) return <ErrorState onRetry={refetch} />;

  const { summary, orders, inventory, sales, recentOrders, topSellingProducts } = data;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — Zyvora OS</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              Command Center
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Active Session
              </span>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Live enterprise analytics, inventory controls, and order telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/audit-logs"
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl transition-all shadow-2xs hover:shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Audit Security
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={format(summary.totalRevenue)}
            trend="+14.2%"
            color="bg-emerald-50 text-emerald-600 border-emerald-200"
            delay={0}
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={summary.totalOrders}
            trend="+8.7%"
            color="bg-teal-50 text-teal-600 border-teal-200"
            delay={0.08}
          />
          <StatCard
            icon={Package}
            label="Total Products"
            value={summary.totalProducts}
            color="bg-purple-50 text-purple-600 border-purple-200"
            delay={0.16}
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={summary.totalUsers}
            color="bg-blue-50 text-blue-600 border-blue-200"
            delay={0.24}
          />
        </div>

        {/* Sales Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Today's Revenue
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{format(sales.todayRevenue)}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                This Month
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{format(sales.thisMonthRevenue)}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Inventory Alerts
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-bold text-amber-600">{inventory.lowStockProducts}</span>
                <span className="text-xs text-slate-500 ml-1.5">Low Stock</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="text-2xl font-bold text-rose-600">{inventory.outOfStockProducts}</span>
                <span className="text-xs text-slate-500 ml-1.5">Out of Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <h3 className="text-base font-display font-semibold text-slate-900 mb-6 flex items-center justify-between">
            <span>Order Pipeline Telemetry</span>
            <span className="text-xs font-mono text-slate-400">Real-time status</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(orders).map(([status, count]) => (
              <div
                key={status}
                className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 transition-colors"
              >
                <p className="text-2xl font-display font-bold text-emerald-600 mb-1">{count}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-display font-semibold text-slate-900">Recent Orders</h3>
              <Link
                to="/admin/orders"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                View All Orders →
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders?.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                      <ShoppingCart className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-slate-500">{order.user?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 mb-1">{format(order.totalAmount)}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-display font-semibold text-slate-900 mb-6">
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {topSellingProducts?.map((prod, i) => (
                <div
                  key={prod.productId}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {prod.image && (
                      <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{prod.title}</p>
                    <p className="text-[11px] text-slate-500">{prod.totalSold} units sold</p>
                  </div>
                  <p className="text-xs font-bold text-emerald-600">{format(prod.price)}</p>
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
