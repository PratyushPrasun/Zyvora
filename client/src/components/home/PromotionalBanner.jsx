import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const PromotionalBanner = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.promo-element', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[85vh] min-h-[640px] overflow-hidden bg-black flex items-center">
      {/* Background Image Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Promotional Showcase"
          className="w-full h-[130%] object-cover object-center filter brightness-90 contrast-105"
        />
      </motion.div>

      {/* Content Container */}
      <Container className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="promo-element inline-flex items-center gap-2 text-accent text-xs font-bold tracking-[0.3em] uppercase mb-6 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20">
            <Sparkles className="w-4 h-4" />
            Limited Campaign Edition
          </div>

          <h2 className="promo-element text-5xl sm:text-7xl lg:text-[6.5rem] font-display font-bold text-white leading-[1.05] tracking-tight mb-8">
            The <span className="italic font-light text-accent">Autumn</span> Capsule
          </h2>

          <p className="promo-element text-lg sm:text-xl text-white/80 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Embrace timeless sophistication with our exclusive season release. Meticulously designed to transcend fleeting trends.
          </p>

          <div className="promo-element">
            <Link to="/shop" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl shadow-black/50"
              >
                <span>Discover The Campaign</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PromotionalBanner;
