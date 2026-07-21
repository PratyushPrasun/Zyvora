import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import PremiumProductCard from './PremiumProductCard';
import Skeleton from '@/components/ui/Skeleton';

const FeaturedProducts = ({ products = [], loading }) => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-black/10 pb-10">
          <div>
            <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Latest Arrivals</span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary">
              The Edit
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-sm md:text-right">
            Discover pieces that define the new standard of contemporary luxury.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.slice(0, 4).map((product, index) => (
              <PremiumProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <Link to="/shop">
            <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-full overflow-hidden hover:pr-12 transition-all duration-300 ease-out">
              <span className="relative z-10 font-medium tracking-wide">Explore All Products</span>
              <ArrowRight className="w-5 h-5 absolute right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out z-10" />
              <div className="absolute inset-0 bg-accent transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
            </button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;
