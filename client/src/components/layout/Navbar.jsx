import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import Container from '@/components/ui/Container';
import CartDrawer from '@/components/cart/CartDrawer';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuthContext();
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-border/40'
            : 'bg-transparent'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl lg:text-2xl font-display font-bold tracking-tight text-primary">
                Zyvora
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative ${
                    isActive(link.to)
                      ? 'text-accent'
                      : 'text-muted hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/shop')}
                className="p-2.5 rounded-xl hover:bg-surface-dark transition-all duration-200 hidden sm:flex"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px] text-muted hover:text-primary transition-colors" />
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2.5 rounded-xl hover:bg-surface-dark transition-all duration-200"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-[18px] h-[18px] text-muted hover:text-primary transition-colors" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shadow-sm shadow-accent/30"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      profileOpen ? 'bg-surface-dark' : 'hover:bg-surface-dark'
                    }`}
                    aria-label="Profile menu"
                  >
                    <User className="w-[18px] h-[18px] text-muted" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-border/50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-border/60 bg-surface/50">
                          <p className="text-sm font-semibold text-primary truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>
                        <div className="p-1.5">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-accent hover:bg-accent/5 rounded-xl transition-all duration-200"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          <Link
                            to="/account/orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-accent hover:bg-accent/5 rounded-xl transition-all duration-200"
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>
                          <Link
                            to="/account/addresses"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-accent hover:bg-accent/5 rounded-xl transition-all duration-200"
                          >
                            <MapPin className="w-4 h-4" />
                            Addresses
                          </Link>
                          <Link
                            to="/account"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-accent hover:bg-accent/5 rounded-xl transition-all duration-200"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <div className="my-1 border-t border-border/60" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-error hover:bg-error/5 rounded-xl transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-accent text-white rounded-xl hover:bg-accent-dark transition-all duration-300 shadow-sm shadow-accent/20 hover:shadow-accent/30"
                >
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-surface-dark transition-all duration-200"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenu ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-t border-border/40"
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenu(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive(link.to)
                          ? 'text-accent bg-accent/5'
                          : 'text-muted hover:text-primary hover:bg-surface-dark'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      to="/login"
                      onClick={() => setMobileMenu(false)}
                      className="block px-4 py-3 text-sm font-medium text-white bg-accent rounded-xl text-center mt-2 shadow-sm shadow-accent/20"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Click outside handler for profile menu */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
