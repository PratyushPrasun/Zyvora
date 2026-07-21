import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';

const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from('.hero-image-wrapper', {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
      })
      .from('.hero-word', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
      }, '-=1')
      .from('.hero-desc', {
        opacity: 0,
        y: 20,
        duration: 1,
      }, '-=0.8')
      .from('.hero-cta', {
        opacity: 0,
        x: -20,
        duration: 0.8,
      }, '-=0.6');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-[#030303] overflow-hidden pt-20 pb-10">
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y: y1 }} className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[150px]" />
        <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col items-start z-20">
            <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-display font-bold tracking-tighter text-white leading-[0.9] mb-8 uppercase">
              <span className="block overflow-hidden"><span className="hero-word block">Curated</span></span>
              <span className="block overflow-hidden"><span className="hero-word block text-gradient-green italic pr-4">Elegance</span></span>
              <span className="block overflow-hidden"><span className="hero-word block">For You.</span></span>
            </h1>
            <p className="hero-desc text-lg sm:text-xl text-white/50 max-w-md font-light mb-10 leading-relaxed">
              Experience the pinnacle of premium design and unparalleled quality. Uncover a collection curated for the extraordinary.
            </p>
            <div className="hero-cta">
              <Link to="/shop" className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-accent hover:text-white transition-all duration-300">
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[70vh] w-full">
            <div className="hero-image-wrapper w-full h-full rounded-[2rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-black/20 z-10 mix-blend-overlay" />
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop" 
                alt="Premium Interior"
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[2s]"
              />
            </div>
            
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-[#111] border border-white/10 p-6 rounded-2xl backdrop-blur-md z-20 shadow-2xl hidden md:block"
            >
              <p className="text-white text-sm font-medium uppercase tracking-widest mb-1">New Season</p>
              <p className="text-accent text-xl font-display italic">Arrivals</p>
            </motion.div>
          </div>
        </div>
      </Container>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
