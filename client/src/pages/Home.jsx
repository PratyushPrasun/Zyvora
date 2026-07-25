import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useProducts } from '@/hooks/useProducts';

// Home Page Sub-Components
import HeroSection from '@/components/home/HeroSection';
import BrandStory from '@/components/home/BrandStory';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import BestSellers from '@/components/home/BestSellers';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);

  // Fetch product showcase data for FeaturedProducts and BestSellers
  const { data, isLoading } = useProducts({ limit: 12, sort: 'latest' });
  const products = data?.products || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Global reveal animation for section elements with .section-reveal class
      gsap.utils.toArray('.section-reveal').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white overflow-hidden">
      <Helmet>
        <title>Zyvora — Premium Curated Shopping</title>
        <meta
          name="description"
          content="Discover premium curated products at Zyvora. Shop the latest in fashion, electronics, and lifestyle with exceptional quality."
        />
      </Helmet>

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Brand Story (with Progressive Scroll-Driven Text Fade & Parallax) */}
      <BrandStory />

      {/* 3. Featured Collections & Categories Showcase (Unified Grid) */}
      <FeaturedCollections />

      {/* 4. Featured Products ("The Edit" Showcase Grid) */}
      <FeaturedProducts products={products.slice(0, 4)} loading={isLoading} />

      {/* 5. Promotional Banner (Campaign Parallax Showcase) */}
      <PromotionalBanner />

      {/* 6. Bestsellers (Interactive Carousel) */}
      {/* <BestSellers products={products.slice(0, 8)} loading={isLoading} /> */}

      {/* 7. Community Testimonials (Dark Mode Accent Cards) */}
      <Testimonials />

      {/* 8. Newsletter Subscription */}
      <Newsletter />
    </div>
  );
};

export default Home;
