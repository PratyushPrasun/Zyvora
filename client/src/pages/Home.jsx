import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useProducts } from '@/hooks/useProducts';

// New Components
import HeroSection from '@/components/home/HeroSection';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import BestSellers from '@/components/home/BestSellers';
import Testimonials from '@/components/home/Testimonials';
import BrandStory from '@/components/home/BrandStory';
import Newsletter from '@/components/home/Newsletter';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Electronics'
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Fashion'
  },
  {
    name: 'Living',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Home+%26+Living'
  },
];

const Home = () => {
  const containerRef = useRef(null);
  
  // Use products hook for FeaturedProducts and BestSellers
  // Fetch a bit more to populate both sections if needed, or share the same.
  const { data, isLoading } = useProducts({ limit: 12, sort: 'latest' });
  const products = data?.products || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Preserve the scroll-triggered animations for sections with .section-reveal
      gsap.utils.toArray('.section-reveal').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <Helmet>
        <title>Zyvora — Premium Curated Shopping</title>
        <meta
          name="description"
          content="Discover premium curated products at Zyvora. Shop the latest in fashion, electronics, and lifestyle with exceptional quality."
        />
      </Helmet>

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Brand Story */}
      <BrandStory />

      {/* 3. Featured Collections (New Editorial Showcase) */}
      <FeaturedCollections />

      {/* 4. Shop by Category (PRESERVED EXACTLY AS IS) */}
      {/* Categories Showcase (New) */}
      <section className="section-reveal py-24 bg-surface relative overflow-hidden">
        <Container>
          <div className="flex flex-col sm:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-accent font-medium tracking-wider text-sm uppercase mb-2 block">Collections</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary">
                Shop by Category
              </h2>
            </div>
            <Link to="/shop" className="text-primary font-medium hover:text-accent transition-colors flex items-center gap-2 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.name} to={cat.link}>
                <motion.div 
                  className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                  whileHover="hover"
                  initial="initial"
                >
                  <motion.img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover"
                    variants={{
                      initial: { scale: 1 },
                      hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <motion.div
                      variants={{
                        initial: { y: 20, opacity: 0.8 },
                        hover: { y: 0, opacity: 1 }
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-3xl font-display font-bold text-white mb-2">{cat.name}</h3>
                      <div className="flex items-center gap-2 text-white/90">
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Featured Products Showcase */}
      <FeaturedProducts products={products.slice(0, 4)} loading={isLoading} />

      {/* 6. Promotional Banner */}
      <PromotionalBanner />

      {/* 7. Best Sellers */}
      <BestSellers products={products.slice(0, 8)} loading={isLoading} />

      {/* 8. Testimonials */}
      <Testimonials />

      {/* 9. Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
