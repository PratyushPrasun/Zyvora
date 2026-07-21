import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Container from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const PromotionalBanner = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.promo-content > *', {
        scrollTrigger: {
          trigger: '.promo-content',
          start: 'top 80%',
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
    <section ref={containerRef} className="relative h-[80vh] min-h-[600px] overflow-hidden bg-black flex items-center">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
          alt="Promotional Fashion"
          className="w-full h-[140%] object-cover object-center"
        />
      </motion.div>

      <Container className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="promo-content text-center max-w-4xl mx-auto px-4">
          <p className="text-accent tracking-[0.3em] uppercase text-sm font-semibold mb-6">Exclusively Yours</p>
          <h2 className="text-5xl sm:text-7xl lg:text-[6rem] font-display font-bold text-white leading-tight mb-8">
            The <span className="italic font-light text-white/90">Autumn</span> Edition
          </h2>
          <p className="text-xl text-white/80 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Embrace the changing seasons with our exclusive new collection. Pieces designed to transcend time and trend.
          </p>
          <Link to="/shop" className="inline-block">
            <button className="bg-white text-black px-10 py-5 rounded-none uppercase tracking-widest text-sm font-semibold hover:bg-accent hover:text-white transition-colors duration-500">
              Discover the Campaign
            </button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default PromotionalBanner;
