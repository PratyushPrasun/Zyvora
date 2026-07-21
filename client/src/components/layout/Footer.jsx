import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-white/80 relative overflow-hidden pt-24 pb-12 border-t border-white/5">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 pr-8">
            <Link to="/" className="inline-flex items-center gap-2 group mb-6">
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                Zyvora
              </span>
              <span className="w-2 h-2 rounded-full bg-accent group-hover:scale-[2] transition-transform duration-500 ease-out" />
            </Link>
            <p className="text-sm leading-loose text-white/50 max-w-sm mb-8 font-light">
              Elevating the everyday with meticulously curated collections. We bridge the gap between uncompromising quality and timeless design.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Links - Shop */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-semibold text-white mb-6 uppercase tracking-[0.2em]">
              Shop
            </h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Best Sellers', 'All Products', 'Categories'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/shop"
                      className="text-sm text-white/50 hover:text-accent transition-colors duration-300 relative group flex w-fit"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300 ease-out" />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Links - Company */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-white mb-6 uppercase tracking-[0.2em]">
              Company
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/50 hover:text-accent transition-colors duration-300 relative group flex w-fit"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300 ease-out" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-white mb-6 uppercase tracking-[0.2em]">
              Updates
            </h4>
            <p className="text-sm text-white/50 mb-6 font-light leading-relaxed">
              Sign up for exclusive offers and our latest editorials.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative group"
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors pr-10"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-accent transition-colors"
                aria-label="Submit"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/40 font-light">
            © {new Date().getFullYear()} Zyvora. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer tracking-wide">Privacy Policy</span>
            <span className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer tracking-wide">Terms of Service</span>
          </div>
        </div>
      </Container>

      {/* Subtle Glow Background */}
      <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
    </footer>
  );
};

export default Footer;
