import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin } from 'lucide-react';
import Container from '@/components/ui/Container';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

const accountNav = [
  { to: '/account', icon: User, label: 'Profile', exact: true },
  { to: '/account/orders', icon: Package, label: 'Orders' },
  { to: '/account/addresses', icon: MapPin, label: 'Addresses' },
];

const DashboardLayout = () => {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20 bg-surface">
        <Container className="py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-56 shrink-0">
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:sticky lg:top-24 p-1 lg:p-0 bg-white lg:bg-transparent rounded-2xl lg:rounded-none border lg:border-0 border-border/50">
                {accountNav.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        active
                          ? 'bg-accent text-white shadow-sm shadow-accent/20'
                          : 'text-muted hover:text-primary hover:bg-surface-dark'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
