import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Star, ChevronDown, ShieldCheck, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Featured Showcase Collections ──────────────────────────
const FEATURED_COLLECTIONS = [
  {
    id: 'fashion',
    category: 'Haute Couture',
    title: 'Atelier Silk Capsule',
    price: '$620',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    rating: '4.95 / 5.0 Rating',
    reviews: 'Over 1,850 Reviews',
    featuredBadge: 'Featured Edition',
    stockStatus: 'In Stock',
    newArrivalTag: 'Spring / Summer 25',
    newArrivalLabel: 'New Arrival',
    footerText: 'Verified Authenticity & Premium Guarantee',
    link: '/shop',
  },
  {
    id: 'electronics',
    category: 'Audio Engineering',
    title: 'Acoustic Precision One',
    price: '$850',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
    rating: '5.0 / 5.0 Rating',
    reviews: 'Over 3,120 Reviews',
    featuredBadge: 'Studio Edition',
    stockStatus: 'Limited Stock',
    newArrivalTag: 'Pro Series 2025',
    newArrivalLabel: 'New Arrival',
    footerText: 'Studio Grade Acoustics & 3-Yr Guarantee',
    link: '/shop',
  },
  {
    id: 'furniture',
    category: 'Architectural Living',
    title: 'Nordic Lounge Edition',
    price: '$480',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop',
    rating: '4.9 / 5.0 Rating',
    reviews: 'Over 2,400 Reviews',
    featuredBadge: 'Featured Edition',
    stockStatus: 'In Stock',
    newArrivalTag: 'Spring / Summer 25',
    newArrivalLabel: 'New Arrival',
    footerText: 'Verified Authenticity & Premium Guarantee',
    link: '/shop',
  },
  {
    id: 'beauty',
    category: 'Luxury Wellness',
    title: 'Botanical Elixir Set',
    price: '$290',
    image: 'https://plus.unsplash.com/premium_photo-1673203734665-0a534c043b7f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: '4.88 / 5.0 Rating',
    reviews: 'Over 1,420 Reviews',
    featuredBadge: 'Wellness Edition',
    stockStatus: 'In Stock',
    newArrivalTag: 'Organic Line',
    newArrivalLabel: 'New Arrival',
    footerText: '100% Organic & Ethically Sourced',
    link: '/shop',
  },
];

// ─── Animated Counter Component ─────────────────────────────
const AnimatedCounter = ({ target, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="hero-stat-item flex flex-col">
      <div className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight flex items-center gap-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] sm:text-xs text-white/50 uppercase tracking-[0.15em] font-medium mt-1">
        {label}
      </div>
    </div>
  );
};

// ─── Interactive 3D Tilt Showcase Card with Auto Content Morphing ───
const InteractiveProductShowcase = () => {
  const cardRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 120, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 120, damping: 25 });

  // Preload image assets immediately to guarantee seamless 60 FPS transitions
  useEffect(() => {
    FEATURED_COLLECTIONS.forEach((col) => {
      const img = new Image();
      img.src = col.image;
    });
  }, []);

  // Timed content change every 5 seconds, pauses when user hovers card
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_COLLECTIONS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsPaused(false);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const current = FEATURED_COLLECTIONS[currentIndex];
  // Power2.out equivalent easing vector [0.25, 1, 0.5, 1]
  const transitionEase = [0.25, 1, 0.5, 1];

  return (
    <div
      className="relative w-full max-w-md lg:max-w-none mx-auto perspective-1000"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Ambient Glow (SVG Gradient - zero scroll blur) */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 via-white/5 to-transparent rounded-[2.5rem] opacity-70 pointer-events-none" />

      {/* Main Showcase Card Frame */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
        className="hero-card-dark relative rounded-2xl overflow-hidden p-3 sm:p-4 z-20"
      >
        {/* Product Image Wrapper */}
        <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-xl overflow-hidden bg-black/40 group">
          {/* Smooth Image Crossfade */}
          <AnimatePresence mode="popLayout">
            <motion.img
              key={current.id}
              src={current.image}
              alt={current.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: transitionEase }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              loading="eager"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none z-10" />

          {/* Floating Badges Inside Image */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
            <AnimatePresence mode="wait">
              <motion.span
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: transitionEase }}
                className="hero-badge text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block"
              >
                {current.featuredBadge}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="absolute top-3 right-3 z-20">
            <AnimatePresence mode="wait">
              <motion.span
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: transitionEase }}
                className="bg-black/70 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-white/10 backdrop-none flex items-center gap-1 font-medium inline-flex"
              >
                <Zap className="w-3 h-3 text-accent shrink-0" /> {current.stockStatus}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Bottom Card Title Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white z-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: transitionEase }}
              >
                <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-0.5">
                  {current.category}
                </div>
                <div className="text-base sm:text-lg font-display font-bold flex items-center justify-between">
                  <span>{current.title}</span>
                  <span className="text-accent font-sans text-sm sm:text-base">{current.price}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Card Metadata Footer */}
        <div className="mt-3.5 px-1 py-1 flex items-center justify-between min-h-[24px]">
          <div className="flex-1 truncate mr-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5, ease: transitionEase }}
                className="flex items-center gap-2 text-white/70 text-xs truncate"
              >
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span className="truncate">{current.footerText}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link
            to={current.link}
            className="text-xs font-semibold text-white hover:text-accent transition-colors flex items-center gap-1.5 group/link shrink-0"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Floating Accent Tag (Top Right Layer) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="hero-card-dark absolute -top-5 -right-3 sm:-top-6 sm:-right-6 px-4 py-2.5 rounded-xl z-30 hidden sm:flex items-center gap-3 shadow-xl"
      >
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5, ease: transitionEase }}
          >
            <div className="text-[9px] uppercase tracking-wider text-white/50 font-medium">
              {current.newArrivalLabel}
            </div>
            <div className="text-xs font-bold text-white font-display">
              {current.newArrivalTag}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Floating Accent Rating Tag (Bottom Left Layer) */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hero-card-dark absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-6 px-4 py-2.5 rounded-xl z-30 hidden sm:flex items-center gap-2.5 shadow-xl"
      >
        <div className="flex items-center text-amber-400 shrink-0">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5, ease: transitionEase }}
          >
            <div className="text-xs font-bold text-white">{current.rating}</div>
            <div className="text-[9px] text-white/50 uppercase tracking-wider font-medium">
              {current.reviews}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


// ─── Main Hero Section ──────────────────────────────────────
const HeroSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Staggered reveal without blur filters
      tl.from('.hero-badge-reveal', {
        opacity: 0,
        y: 15,
        duration: 0.8,
      })
      .from('.hero-title-reveal', {
        opacity: 0,
        y: 25,
        duration: 1,
        stagger: 0.15,
      }, '-=0.5')
      .from('.hero-desc-reveal', {
        opacity: 0,
        y: 20,
        duration: 0.8,
      }, '-=0.6')
      .from('.hero-cta-reveal', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
      }, '-=0.5')
      .from('.hero-stats-reveal', {
        opacity: 0,
        y: 20,
        duration: 0.8,
      }, '-=0.4')
      .from('.hero-card-reveal', {
        opacity: 0,
        scale: 0.95,
        duration: 1.1,
      }, '-=1.0');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={containerRef}
      className="hero-crisp-container relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center bg-[#050505] overflow-hidden pt-24 pb-16 lg:py-20"
    >
      {/* Grain Overlay */}
      <div className="hero-grain" />

      {/* Subtle Background Radial Gradients (No heavy CSS blurs) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Background Marquee Ticker */}
      <div className="absolute top-16 left-0 w-full overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="hero-marquee-track">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="text-[12vw] lg:text-[9vw] font-display font-extrabold text-white/[0.03] uppercase tracking-[0.25em] px-8 select-none whitespace-nowrap"
            >
              ZYVORA LUXURY
            </span>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">

          {/* Left Content (Col 1 to 7) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Tagline Badge */}
            <div className="hero-badge-reveal mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 hero-badge rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold">
                  Curated Elegance & Contemporary Luxury
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title-reveal text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight text-white leading-[1.06] mb-6">
              Refined Living <br />
              <span className="text-gradient-green italic font-normal pr-2">Curated Exclusively</span>
              <br />
              For You.
            </h1>

            {/* Description */}
            <p className="hero-desc-reveal text-base sm:text-lg text-white/60 font-light leading-relaxed max-w-xl mb-8 sm:mb-10">
              Discover an extraordinary selection of premium design, fashion, and lifestyle essentials. Crafting timeless aesthetic experiences for the discerning collector.
            </p>

            {/* Call to Actions */}
            <div className="hero-cta-reveal flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10 sm:mb-12">
              <Link to="/shop" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hero-btn-primary w-full sm:w-auto px-8 py-4 rounded-full font-medium text-sm sm:text-base flex items-center justify-center gap-3 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link to="/shop" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hero-btn-secondary w-full sm:w-auto px-7 py-4 rounded-full font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <span>Featured Catalog</span>
                </motion.button>
              </Link>
            </div>

            {/* Metrics Bar */}
            <div className="hero-stats-reveal w-full pt-6 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg">
                <AnimatedCounter target={500} suffix="+" label="Curated Products" />
                <AnimatedCounter target={50} suffix="K+" label="Global Clients" />
                <div className="hero-stat-item flex flex-col">
                  <div className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                    <span>4.9</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/50 uppercase tracking-[0.15em] font-medium mt-1">
                    Client Rating
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Showcase (Col 8 to 12) */}
          <div className="hero-card-reveal lg:col-span-5 w-full mt-4 lg:mt-0">
            <InteractiveProductShowcase />
          </div>

        </div>
      </div>

      {/* Minimal Scroll Cue Button (Replaces old bar) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          onClick={handleScrollDown}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5 text-white/40 hover:text-accent transition-colors group cursor-pointer p-2"
          aria-label="Scroll Down"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium group-hover:text-accent transition-colors">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
