import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusCircle,
  ArrowLeft,
} from 'lucide-react';
import Container from '@/components/ui/Container';

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/products/new', icon: PlusCircle, label: 'Add Product' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
];

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Admin Top Bar */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-border/40 sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Back to Store</span>
              </Link>
              <div className="h-5 w-px bg-border" />
              <Link to="/admin" className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-primary">Zyvora</span>
                <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Admin</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex gap-8 py-8 lg:py-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {adminNav.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'bg-accent text-white shadow-sm shadow-accent/20'
                        : 'text-muted hover:text-primary hover:bg-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Nav */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-border/40 z-40 px-4 py-2 safe-area-bottom">
            <div className="flex items-center justify-around">
              {adminNav.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                      active ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${active ? 'text-accent' : ''}`} />
                    <span className="text-[10px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0 pb-20 lg:pb-0">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default AdminLayout;
