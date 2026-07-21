import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import PremiumProductCard from './PremiumProductCard';
import Skeleton from '@/components/ui/Skeleton';

const BestSellers = ({ products = [], loading }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Most Loved</span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary">
              Bestsellers
            </h2>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Container>

      <div className="pl-4 sm:pl-8 md:pl-16 lg:pl-[max(4rem,calc((100vw-1280px)/2))]">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-12 pt-4 pr-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] snap-start">
                <Skeleton.Card />
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <div key={product._id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] snap-start">
                <PremiumProductCard product={product} index={index} />
              </div>
            ))
          )}
          <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] snap-start flex items-center justify-center bg-[#f8f8f8] rounded-[1rem] aspect-[3/4] mb-5">
            <Link to="/shop" className="flex flex-col items-center justify-center text-center group p-8">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-medium text-primary mb-2">View All<br />Bestsellers</h3>
              <p className="text-sm text-muted-foreground">Explore the full collection</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
