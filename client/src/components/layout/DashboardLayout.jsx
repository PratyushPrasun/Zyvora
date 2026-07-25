import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';
import Container from '@/components/ui/Container';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { useAuthContext } from '@/contexts/AuthContext';

const accountNav = [
  { to: '/account', icon: User, label: 'Profile', exact: true },
  { to: '/account/orders', icon: Package, label: 'Orders' },
  { to: '/account/addresses', icon: MapPin, label: 'Addresses' },
];

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuthContext();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      
      <main className="flex-1">
        {/* Unified Page Header for Dashboard */}
        <div className="page-header pt-24 lg:pt-28 pb-8">
          <div className="page-header-glow" />
          <Container className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary tracking-tight">
                My Account
              </h1>
              <p className="text-muted mt-2 font-light">
                Manage your orders, addresses, and profile settings.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-border/60 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <span className="font-display font-bold text-accent">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{user?.name}</p>
                  <p className="text-xs text-muted">Premium Member</p>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-28">
                <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible p-1.5 lg:p-4 bg-white rounded-2xl lg:rounded-3xl border border-border/60 shadow-sm custom-scrollbar">
                  {accountNav.map((item) => {
                    const active = isActive(item);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 relative group ${
                          active
                            ? 'text-accent-dark'
                            : 'text-muted hover:text-primary hover:bg-surface'
                        }`}
                      >
                        {active && (
                          <motion.div
                            layoutId="dashboardNav"
                            className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-xl"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <item.icon className={`w-4.5 h-4.5 relative z-10 transition-colors ${active ? 'text-accent' : 'text-muted-light group-hover:text-primary'}`} />
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="h-px bg-border/60 my-2 hidden lg:block" />
                  
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium whitespace-nowrap text-muted hover:text-error hover:bg-error/5 transition-all duration-300 group hidden lg:flex"
                  >
                    <LogOut className="w-4.5 h-4.5 text-muted-light group-hover:text-error transition-colors" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default DashboardLayout;
