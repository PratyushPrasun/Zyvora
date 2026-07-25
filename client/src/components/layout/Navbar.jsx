import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Track scroll position for glass effect and height transition
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 64]);
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.85)']
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.08)']
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and profile dropdown on route change
  useEffect(() => {
    setMobileMenu(false);
    setProfileOpen(false);
    setSearchExpanded(false);
  }, [location.pathname]);

  // Focus search input when expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchExpanded(false);
      setSearchTerm('');
    }
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
        style={{
          height: headerHeight,
          backgroundColor: headerBackground,
          borderColor: headerBorder,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b flex items-center transition-shadow duration-300 backdrop-blur-xl"
      >
        <Container className="w-full">
          <div className="flex items-center justify-between h-full w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 group shrink-0 outline-none">
              <motion.span 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="text-xl lg:text-2xl font-display font-bold tracking-tight text-primary transition-colors"
              >
                Zyvora
              </motion.span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300 ease-out shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2 relative">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative px-4 py-2 text-md rounded-xl outline-none group overflow-hidden"
                  >
                    <span className={`relative z-10 transition-colors duration-300 ${active ? 'text-accent font-semibold' : 'text-muted group-hover:text-primary'}`}>
                      {link.label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="nav-active-bg"
                        // className="absolute inset-0 bg-accent/10 rounded-xl z-0 border border-accent/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              
              {/* Expandable Search */}
              <div className="hidden sm:flex items-center relative h-10">
                <AnimatePresence>
                  {searchExpanded && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      onSubmit={handleSearchSubmit}
                      className="absolute right-0 top-0 bottom-0 overflow-hidden flex items-center bg-white border border-border/80 rounded-full shadow-sm focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10 transition-all duration-300"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-full pl-10 pr-4 bg-transparent outline-none text-sm text-primary placeholder:text-muted-light font-medium"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchExpanded(!searchExpanded)}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${searchExpanded ? 'text-accent' : 'text-muted hover:text-primary hover:bg-surface'}`}
                  aria-label="Search"
                >
                  {searchExpanded ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
                </motion.button>
              </div>

              {/* Cart */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCartOpen(true)}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface text-muted hover:text-primary transition-all duration-300"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key="cart-badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center shadow-sm shadow-accent/40 pointer-events-none"
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative ml-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      profileOpen ? 'border-accent/30 bg-accent/5 text-accent' : 'border-transparent bg-surface text-muted hover:text-primary hover:border-border'
                    }`}
                    aria-label="Profile menu"
                  >
                    <User className="w-[18px] h-[18px]" />
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-black/[0.08] border border-border/60 overflow-hidden transform-gpu"
                      >
                        <div className="px-5 py-4 border-b border-border/60 bg-gradient-to-b from-surface/50 to-transparent">
                          <p className="text-sm font-bold text-primary truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted font-medium truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>
                        <div className="p-2 space-y-0.5">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-accent hover:bg-accent/5 rounded-2xl transition-all duration-200 group"
                            >
                              <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              Admin Panel
                            </Link>
                          )}
                          <Link
                            to="/account/orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-primary hover:bg-surface-dark rounded-2xl transition-all duration-200 group"
                          >
                            <Package className="w-4 h-4 group-hover:scale-110 transition-transform text-muted-light group-hover:text-primary" />
                            My Orders
                          </Link>
                          <Link
                            to="/account/addresses"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-primary hover:bg-surface-dark rounded-2xl transition-all duration-200 group"
                          >
                            <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform text-muted-light group-hover:text-primary" />
                            Addresses
                          </Link>
                          <Link
                            to="/account"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-primary hover:bg-surface-dark rounded-2xl transition-all duration-200 group"
                          >
                            <User className="w-4 h-4 group-hover:scale-110 transition-transform text-muted-light group-hover:text-primary" />
                            Profile
                          </Link>
                          <div className="my-1.5 border-t border-border/40" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-2xl transition-all duration-200 group"
                          >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
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
                  className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-primary text-white rounded-full hover:bg-primary-light transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface transition-all duration-200 text-primary z-50 relative ml-1"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenu ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-[18px] h-[18px]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-[18px] h-[18px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-white/60 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
              className="pt-24 px-6 pb-6"
            >
              <div className="flex items-center bg-white border border-border/80 rounded-2xl mb-8 shadow-sm focus-within:border-accent/40 focus-within:ring-4 focus-within:ring-accent/10 transition-all p-1">
                <Search className="w-5 h-5 text-muted-light ml-3" />
                <form onSubmit={handleSearchSubmit} className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none outline-none px-3 py-3 text-sm font-medium text-primary placeholder:text-muted-light"
                  />
                </form>
              </div>

              <nav className="space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenu(false)}
                      className={`block px-5 py-4 text-base font-bold rounded-2xl transition-all duration-300 ${
                        isActive(link.to)
                          ? 'text-accent bg-accent/5 border border-accent/10 shadow-sm'
                          : 'text-primary hover:bg-surface border border-transparent'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-8 border-t border-border/60"
                >
                  <Link
                    to="/login"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 text-sm font-bold text-white bg-primary rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                  >
                    Sign In to your account
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Click outside handler for profile menu */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
