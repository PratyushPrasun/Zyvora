import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    id: 1,
    title: 'Minimalist Core',
    subtitle: 'The essentials reimagined.',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop',
    link: '/shop?category=Electronics',
    colSpan: 'lg:col-span-8',
    height: 'h-[500px]',
  },
  {
    id: 2,
    title: 'Urban Chic',
    subtitle: 'City ready styles.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Fashion',
    colSpan: 'lg:col-span-4',
    height: 'h-[500px] lg:h-[600px]',
  },
  {
    id: 3,
    title: 'Modern Living',
    subtitle: 'Elevate your space.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop',
    link: '/shop?category=Home',
    colSpan: 'lg:col-span-12',
    height: 'h-[500px]',
  },
];

const FeaturedCollections = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.collection-item').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <Container>
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary mb-6 leading-tight">
              Curated <span className="text-accent italic font-light">Collections</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Explore our meticulously handpicked selections designed to elevate your everyday lifestyle with uncompromising quality.
            </p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-primary font-medium border-b border-primary/20 pb-1 hover:border-primary transition-colors">
            View All Collections <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {collections.map((item, index) => (
            <Link 
              key={item.id} 
              to={item.link} 
              className={`collection-item group relative rounded-[2rem] overflow-hidden ${item.colSpan} ${item.height} block`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10" />
              <motion.img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 max-w-sm">
                  <h3 className="text-2xl font-display font-bold text-primary mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.subtitle}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider">
                    Explore <ArrowUpRight className="w-4 h-4" />
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
