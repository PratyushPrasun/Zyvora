import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Lock,
  Award,
  Heart,
  Leaf,
  Lightbulb,
  Palette,
  Gem,
  Users,
  ChevronDown,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

// ─── Animated Counter (IntersectionObserver pattern from HeroSection) ────
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
          const duration = 2000;
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
    <div ref={ref} className="text-center">
      <p className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-accent mb-2 tracking-tight">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs font-semibold text-white/60 uppercase tracking-[0.18em]">
        {label}
      </p>
    </div>
  );
};

// ─── Data ────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: '2021',
    title: 'The Spark',
    description:
      'Zyvora began as a vision — to bridge the gap between uncompromising quality and modern aesthetic luxury, making premium products accessible to everyone.',
  },
  {
    year: '2022',
    title: 'Building the Foundation',
    description:
      'We partnered with artisans and brands across the globe, curating a collection that reflects our commitment to craftsmanship, sustainability, and design excellence.',
  },
  {
    year: '2023',
    title: 'Community First',
    description:
      'Our community grew to thousands of discerning customers who share our passion for intentional living and elevated everyday experiences.',
  },
  {
    year: '2024',
    title: 'Scaling with Purpose',
    description:
      'We expanded our categories, refined our logistics, and doubled down on customer experience — earning a 99% satisfaction rate from our growing community.',
  },
  {
    year: '2025',
    title: 'The Future',
    description:
      'Today, Zyvora continues to push boundaries — innovating our platform, expanding our global reach, and staying true to the values that started it all.',
  },
];

const FEATURES = [
  {
    icon: Award,
    title: 'Premium Quality',
    description:
      'Every product is rigorously vetted for craftsmanship, materials, and longevity before earning a place in our collection.',
  },
  {
    icon: Lock,
    title: 'Secure Shopping',
    description:
      'Industry-leading encryption and fraud protection ensure your personal and payment data is always safe.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description:
      'Expedited shipping with real-time tracking, ensuring your curated selections arrive swiftly and in pristine condition.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Products',
    description:
      'Authenticity guaranteed. We source directly from verified brands and artisans with transparent supply chains.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description:
      'Dedicated concierge support, hassle-free returns, and a shopping experience designed around your needs.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Approach',
    description:
      'We prioritize eco-conscious brands, recyclable packaging, and ethical sourcing across our entire supply chain.',
  },
];

const PHILOSOPHY = [
  {
    icon: Lightbulb,
    number: '01',
    title: 'Innovation',
    description:
      'Constantly evolving our platform and partnerships to bring you the most forward-thinking products and experiences.',
  },
  {
    icon: Palette,
    number: '02',
    title: 'Design',
    description:
      'We believe great design is not just visual — it\'s how a product feels, functions, and fits into your daily life.',
  },
  {
    icon: Gem,
    number: '03',
    title: 'Quality',
    description:
      'Uncompromising standards from sourcing to delivery. Every detail is meticulously considered and tested.',
  },
  {
    icon: Users,
    number: '04',
    title: 'Community',
    description:
      'Built for people who value intentional living. Our community inspires and shapes everything we do.',
  },
];

const STATS = [
  { target: 50, suffix: 'K+', label: 'Happy Customers' },
  { target: 500, suffix: '+', label: 'Premium Products' },
  { target: 120, suffix: 'K+', label: 'Orders Delivered' },
  { target: 99, suffix: '%', label: 'Satisfaction Rate' },
];

// ─── Component ───────────────────────────────────────────────
const About = () => {
  const heroRef = useRef(null);
  const timelineRef = useRef(null);

  // GSAP Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.about-badge-reveal', { opacity: 0, y: 15, duration: 0.8 })
        .from('.about-title-reveal', { opacity: 0, y: 25, duration: 1 }, '-=0.5')
        .from('.about-desc-reveal', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
        .from('.about-breadcrumb-reveal', { opacity: 0, y: 10, duration: 0.6 }, '-=0.5');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // GSAP Timeline section scroll reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          x: i % 2 === 0 ? -40 : 40,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

      // Timeline line draw
      const line = document.querySelector('.timeline-line-fill');
      if (line) {
        gsap.from(line, {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
          },
          scaleY: 0,
          transformOrigin: 'top center',
        });
      }
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Story — Zyvora</title>
        <meta
          name="description"
          content="Discover the story behind Zyvora — our mission, values, and commitment to curating premium products for intentional living."
        />
      </Helmet>

      {/* ───── Premium Dark Hero ───── */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center bg-[#050505] overflow-hidden"
      >
        {/* Grain */}
        <div className="hero-grain" />

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.07)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        </div>

        {/* Background marquee */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none opacity-20">
          <div className="hero-marquee-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="text-[14vw] sm:text-[10vw] font-display font-extrabold text-white/[0.03] uppercase tracking-[0.25em] px-8 select-none whitespace-nowrap"
              >
                OUR STORY
              </span>
            ))}
          </div>
        </div>

        <Container className="relative z-10 text-center py-20 sm:py-28 lg:py-32">
          {/* Breadcrumb */}
          <div className="about-breadcrumb-reveal mb-8">
            <Breadcrumb items={[{ label: 'Our Story' }]} />
          </div>

          {/* Badge */}
          <div className="about-badge-reveal mb-6">
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
              <Sparkles className="w-3.5 h-3.5" />
              Since 2021
            </span>
          </div>

          {/* Title */}
          <h1 className="about-title-reveal text-5xl sm:text-6xl lg:text-8xl font-display font-bold text-white tracking-tight mb-6 leading-[1.05]">
            Defining{' '}
            <span className="text-gradient-green italic font-light">Elegance</span>
          </h1>

          {/* Description */}
          <p className="about-desc-reveal text-base sm:text-lg lg:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
            Zyvora was born from a simple belief: everyone deserves access to
            exceptional products that combine beauty, uncompromised quality, and purpose.
          </p>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-12 flex flex-col items-center text-white/30"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Discover</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Container>
      </section>

      {/* ───── Our Story Timeline ───── */}
      <section ref={timelineRef} className="bg-white py-20 sm:py-28 lg:py-32 relative overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 sm:mb-20"
          >
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              Our Journey
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary tracking-tight mb-4">
              The Story So{' '}
              <span className="italic font-light text-accent">Far</span>
            </h2>
            <p className="text-muted font-light text-lg max-w-xl mx-auto">
              From a spark of inspiration to a community of thousands — here's how Zyvora came to be.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-border/40">
              <div className="timeline-line-fill absolute inset-0 bg-accent/40" />
            </div>

            {TIMELINE.map((item, index) => (
              <div
                key={item.year}
                className={`timeline-item relative flex items-start gap-6 sm:gap-0 mb-12 last:mb-0 ${
                  index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-4 border-white z-10 mt-1.5 shadow-sm shadow-accent/30" />

                {/* Content card */}
                <div className={`ml-14 sm:ml-0 sm:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8 sm:text-left'}`}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm hover:border-accent/30 hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-accent text-sm font-bold font-display tracking-wide">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-display font-bold text-primary mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted font-light text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── Why Choose Us ───── */}
      <section className="bg-surface py-20 sm:py-28 lg:py-32 relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-accent/3 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              Why Zyvora
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary tracking-tight mb-4">
              Built on{' '}
              <span className="italic font-light text-accent">Trust</span>
            </h2>
            <p className="text-muted font-light text-lg max-w-xl mx-auto">
              Six pillars that define every interaction, product, and experience at Zyvora.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white rounded-2xl p-8 border border-border/60 shadow-sm hover:border-accent/30 hover:shadow-lg transition-all duration-400 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-display font-bold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted font-light text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── Brand Philosophy ───── */}
      <section className="bg-white py-20 sm:py-28 lg:py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 sm:mb-20"
          >
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              Our Philosophy
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary tracking-tight mb-4">
              What Drives{' '}
              <span className="italic font-light text-accent">Us</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {PHILOSOPHY.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <span className="text-7xl sm:text-8xl font-display font-bold text-gradient-green opacity-20 select-none">
                    {item.number}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-surface border border-border/60 flex items-center justify-center group-hover:border-accent/30 group-hover:bg-accent/5 transition-all duration-300">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-muted font-light text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── Statistics ───── */}
      <section className="relative bg-[#050505] py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Grain */}
        <div className="hero-grain" />

        {/* Ambient glows */}
        <div className="absolute top-0 left-1/3 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              By the Numbers
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
              Impact That{' '}
              <span className="italic font-light text-gradient-green">Speaks</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STATS.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ───── Behind the Brand ───── */}
      <section className="bg-white py-20 sm:py-28 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-[2rem] overflow-hidden aspect-[4/5] border border-border/60 shadow-lg relative group">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
                  alt="Zyvora curation process"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Floating accent card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl px-6 py-4 shadow-xl border border-border/60 z-10"
              >
                <p className="text-sm font-bold text-primary font-display">Curated with Care</p>
                <p className="text-xs text-muted font-light mt-0.5">Every product, hand-selected</p>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                Behind the Brand
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight mb-6">
                Craftsmanship Meets{' '}
                <span className="italic font-light text-accent">Purpose</span>
              </h2>
              <div className="space-y-5">
                <p className="text-muted font-light text-lg leading-relaxed">
                  At Zyvora, we don't just sell products — we curate experiences. Every item
                  in our collection has been carefully selected by our team of curators who
                  travel the world to discover exceptional craftsmanship.
                </p>
                <p className="text-muted font-light text-lg leading-relaxed">
                  From the artisan workshops of Italy to the design studios of Scandinavia,
                  we obsess over every detail — materials, construction, aesthetics, and
                  sustainability — to ensure that what reaches you is nothing short of
                  extraordinary.
                </p>
                <p className="text-muted font-light text-lg leading-relaxed">
                  We believe the things you surround yourself with should inspire you. That's
                  the Zyvora promise.
                </p>
              </div>

              <div className="flex items-center gap-8 mt-8 pt-8 border-t border-border/60">
                <div>
                  <p className="text-3xl font-display font-bold text-accent">30+</p>
                  <p className="text-xs text-muted font-light uppercase tracking-wider mt-1">Countries</p>
                </div>
                <div className="w-px h-10 bg-border/60" />
                <div>
                  <p className="text-3xl font-display font-bold text-accent">200+</p>
                  <p className="text-xs text-muted font-light uppercase tracking-wider mt-1">Brand Partners</p>
                </div>
                <div className="w-px h-10 bg-border/60" />
                <div>
                  <p className="text-3xl font-display font-bold text-accent">5-Star</p>
                  <p className="text-xs text-muted font-light uppercase tracking-wider mt-1">Rated</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="relative bg-[#050505] py-20 sm:py-28 lg:py-32 overflow-hidden">
        <div className="hero-grain" />
        <div className="absolute top-0 right-1/4 w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-6 block">
              Join the Journey
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight mb-6">
              Ready to Experience{' '}
              <span className="italic font-light text-gradient-green">Zyvora</span>?
            </h2>
            <p className="text-lg text-white/50 font-light mb-10 max-w-xl mx-auto">
              Explore our curated collection of premium products or reach out to our concierge team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop">
                <Button variant="glow" size="xl" className="min-w-[200px] rounded-full">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full font-medium text-base text-white/80 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Get In Touch
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default About;
