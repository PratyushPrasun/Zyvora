import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusCircle,
  Activity,
  ArrowLeft,
  LogOut,
  Shield,
  Sparkles,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuthContext } from '@/contexts/AuthContext';
import ConflictModal from '@/components/ui/ConflictModal';

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/products/new', icon: PlusCircle, label: 'Add Product' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/audit-logs', icon: Activity, label: 'Audit Logs' },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const [conflictState, setConflictState] = useState({
    isOpen: false,
    message: '',
  });

  useEffect(() => {
    const handleConflict = (event) => {
      setConflictState({
        isOpen: true,
        message: event.detail?.message || '',
      });
    };

    window.addEventListener('api-conflict-error', handleConflict);
    return () => window.removeEventListener('api-conflict-error', handleConflict);
  }, []);

  const isActive = (item) => {
    if (item.exact || item.to === '/admin') {
      return location.pathname === item.to;
    }
    if (location.pathname === item.to) return true;
    if (location.pathname.startsWith(item.to + '/')) {
      return !adminNav.some(
        (other) =>
          other.to !== item.to &&
          other.to.length > item.to.length &&
          (location.pathname === other.to || location.pathname.startsWith(other.to + '/'))
      );
    }
    return false;
  };

  const handleConflictRefresh = () => {
    setConflictState({ isOpen: false, message: '' });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 antialiased selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Top Bar — Modern Enterprise Light Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 text-xs font-medium bg-slate-100/80 hover:bg-slate-200/60 px-3 py-1.5 rounded-xl border border-slate-200/80"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </Link>
              <div className="h-4 w-px bg-slate-200" />
              <Link to="/admin" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                    Zyvora
                    <span className="text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 uppercase">
                      Admin OS
                    </span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900">{user?.name || 'Administrator'}</span>
                  <span className="text-[10px] text-slate-500">{user?.email || 'admin@zyvora.com'}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className="flex gap-8 py-8 lg:py-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 space-y-6">
              <nav className="space-y-1 bg-white border border-slate-200/80 p-2 rounded-2xl shadow-2xs">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Menu
                </div>
                {adminNav.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative ${
                        active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                      {item.label}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-2xs"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* System Info Banner */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Redis & Lock Ready</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Optimistic locking & multi-admin concurrency active.
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                  <span>Engine: v2.4</span>
                  <span className="text-emerald-700 font-mono font-bold">LIVE</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-200 z-40 px-3 py-2 safe-area-bottom shadow-lg">
            <div className="flex items-center justify-around">
              {adminNav.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                      active ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? 'text-emerald-600' : ''}`} />
                    <span className="text-[10px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <main className="flex-1 min-w-0 pb-20 lg:pb-0">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </Container>

      {/* Global Optimistic Concurrency Conflict Modal */}
      <ConflictModal
        isOpen={conflictState.isOpen}
        message={conflictState.message}
        onClose={() => setConflictState({ isOpen: false, message: '' })}
        onRefresh={handleConflictRefresh}
        onViewDetails={() => {
          setConflictState({ isOpen: false, message: '' });
          navigate('/admin/products');
        }}
      />
    </div>
  );
};

export default AdminLayout;
