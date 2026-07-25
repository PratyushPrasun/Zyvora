import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import PremiumProductCard from './PremiumProductCard';
import Skeleton from '@/components/ui/Skeleton';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProducts = ({ products = [], loading }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.product-card-wrapper', {
        scrollTrigger: {
          trigger: '.product-grid-container',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-4 lg:py-8 bg-[#fcfcfc] border-y border-black/5 relative">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 border-b border-black/5 pb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-accent text-xs font-bold tracking-[0.25em] uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              Latest Arrivals
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary tracking-tight">
              The <span className="text-accent italic font-light">Edit</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md font-light leading-relaxed">
            Hand-selected pieces defining the new benchmark of contemporary design & lifestyle.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton.Card />
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.slice(0, 4).map((product, index) => (
              <div key={product._id} className="product-card-wrapper">
                <PremiumProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/shop">
            <button className="group relative inline-flex items-center justify-center gap-3 px-10 py-4.5 bg-primary text-white rounded-full overflow-hidden hover:pr-14 transition-all duration-300 ease-out shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10">
              <span className="relative z-10 font-bold text-sm tracking-wider uppercase">Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4 absolute right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out z-10 text-white" />
              <div className="absolute inset-0 bg-accent transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
            </button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;
