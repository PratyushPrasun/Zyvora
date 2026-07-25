import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Container from '@/components/ui/Container';

// ─── Link Data (all original routes preserved exactly) ───────
const SHOP_LINKS = [
  { label: 'Shop Catalog', to: '/shop' },
  { label: 'Categories', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?sort=latest' },
  { label: 'Best Sellers', to: '/shop' },
];

const SUPPORT_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/contact' },
  { label: 'Shipping Info', to: '/contact' },
  { label: 'Returns Policy', to: '/contact' },
];

const COMPANY_LINKS = [
  { label: 'About Zyvora', to: '/about' },
  { label: 'Privacy Policy', to: '/about' },
  { label: 'Terms & Conditions', to: '/about' },
];

// ─── Social Data (all original URLs preserved) ──────────────
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

// ─── Footer Link Column ─────────────────────────────────────
const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="text-[11px] font-semibold text-white/90 uppercase tracking-[0.18em] mb-4">
      {title}
    </h4>
    <ul className="space-y-2.5">
      {links.map((item) => (
        <li key={item.label}>
          <Link
            to={item.to}
            className="text-xs text-white/50 hover:text-accent transition-colors duration-250 inline-flex items-center gap-1 group relative"
          >
            <span className="relative">
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300 ease-out" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// ─── Component ───────────────────────────────────────────────
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#050505] text-white/80 relative overflow-hidden border-t border-white/10">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* ───── Newsletter Strip ───── */}
      <div className="relative z-10 border-b border-white/[0.06]">
        <Container>
          <div className="py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-display font-bold text-white mb-1">
                Stay in the Loop
              </h4>
              <p className="text-xs text-white/40 font-light">
                Exclusive edits & new releases straight to your inbox.
              </p>
            </div>

            <form
              onSubmit={handleNewsletter}
              className="relative flex items-center w-full sm:w-auto sm:min-w-[320px]"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all duration-300 pr-12"
                required
              />
              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute right-1.5 w-9 h-9 rounded-full bg-accent flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1.5 w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-dark hover:scale-105 transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </div>
        </Container>
      </div>

      {/* ───── Main Grid ───── */}
      <Container className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 py-12 lg:py-14">

          {/* Brand (Col 1-4) */}
          <div className="sm:col-span-2 lg:col-span-4 pr-0 lg:pr-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
              <span className="text-2xl font-display font-bold text-white tracking-tight">
                Zyvora
              </span>
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-accent"
              />
            </Link>
            <p className="text-xs leading-relaxed text-white/45 max-w-sm mb-6 font-light">
              Curating timeless design & elevated everyday living. Bridging
              uncompromising quality with modern aesthetic luxury.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white hover:border-accent/40 hover:bg-accent/15 transition-colors duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop (Col 5-6) */}
          <div className="lg:col-span-2">
            <FooterColumn title="Shop" links={SHOP_LINKS} />
          </div>

          {/* Support (Col 7-8) */}
          <div className="lg:col-span-2">
            <FooterColumn title="Support" links={SUPPORT_LINKS} />
          </div>

          {/* Company (Col 9-10) */}
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>

          {/* Quick Info (Col 11-12) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-white/90 uppercase tracking-[0.18em] mb-4">
              Need Help?
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/60 font-medium">Email</p>
                <p className="text-xs text-white/40 font-light">concierge@zyvora.com</p>
              </div>
              <div>
                <p className="text-xs text-white/60 font-medium">Phone</p>
                <p className="text-xs text-white/40 font-light">+91 98765 43210</p>
              </div>
              <div>
                <p className="text-xs text-white/60 font-medium">Hours</p>
                <p className="text-xs text-white/40 font-light">Mon — Fri, 9AM — 6PM IST</p>
              </div>
            </div>
          </div>

        </div>

        {/* ───── Bottom Bar ───── */}
        <div className="border-t border-white/[0.06] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/35 font-light tracking-wide">
            © {currentYear}{' '}
            <span className="text-white/60 font-medium">Zyvora Inc.</span> All
            rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            {[
              { label: 'Privacy Policy', to: '/about' },
              { label: 'Terms of Service', to: '/about' },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/15 text-[11px]">·</span>}
                <Link
                  to={item.to}
                  className="text-[11px] text-white/35 hover:text-white/70 transition-colors duration-200 tracking-wide"
                >
                  {item.label}
                </Link>
              </span>
            ))}
            <span className="text-white/15 text-[11px]">·</span>
            <span className="text-[11px] text-white/35 hover:text-white/70 transition-colors duration-200 tracking-wide cursor-pointer">
              Cookies
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
