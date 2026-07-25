import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    id: 1,
    title: 'Minimalist Tech',
    subtitle: 'Acoustics & Precision Electronics.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop',
    link: '/shop?category=Electronics',
    colSpan: 'lg:col-span-7',
    height: 'h-[460px] lg:h-[540px]',
  },
  {
    id: 2,
    title: 'Urban Chic',
    subtitle: 'Contemporary Fashion Capsules.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Fashion',
    colSpan: 'lg:col-span-5',
    height: 'h-[460px] lg:h-[540px]',
  },
  {
    id: 3,
    title: 'Modern Living',
    subtitle: 'Architectural Home & Interior Aesthetics.',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop',
    link: '/shop?category=Home+%26+Living',
    colSpan: 'lg:col-span-5',
    height: 'h-[460px] lg:h-[540px]',
  },
  {
    id: 4,
    title: 'Atelier Accessories',
    subtitle: 'Crafted Leatherware & Daily Essentials.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    link: '/shop?category=Accessories',
    colSpan: 'lg:col-span-7',
    height: 'h-[460px] lg:h-[540px]',
  },
];

const FeaturedCollections = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.collection-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
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
    <section ref={containerRef} className="py-4 lg:py-6 bg-white relative overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="mb-8 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-bold tracking-[0.25em] uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              Categorical Curation
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary leading-tight">
              Curated <span className="text-accent italic font-light">Collections</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider border-b-2 border-primary/20 pb-1 hover:border-accent hover:text-accent transition-all duration-300 group"
          >
            <span>Explore All Categories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`collection-card group relative rounded-[2.5rem] overflow-hidden ${item.colSpan} ${item.height} block border border-black/5 shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-all duration-500`}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-colors duration-500 z-10" />
              
              {/* Image with Framer Motion Zoom */}
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              />

              {/* Category Pill Tag */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-primary tracking-wider uppercase shadow-sm">
                  {item.category}
                </span>
              </div>

              {/* Content Box */}
              <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm font-light mb-6 max-w-md leading-relaxed">
                    {item.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-5 py-2.5 rounded-full group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <span>Shop Category</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedCollections;
