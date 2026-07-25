import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';
import Container from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Eleanor Vance',
    role: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    content: 'The attention to detail is simply unmatched. Every piece I have ordered from Zyvora has exceeded my expectations in both quality and design aesthetics.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: 'Finally, a curated marketplace that truly understands premium luxury. The shopping experience is seamless, and the product curation is incredibly tasteful.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'Verified Buyer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    content: 'I was hesitant at first, but the quality of the materials and the exceptional customer service have made me a loyal customer for life. Highly recommended.',
    rating: 5,
  },
];

const Testimonials = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered card entrance reveal
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '.testimonial-grid',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Floating ambient background motion
      gsap.to('.ambient-glow-1', {
        y: -30,
        x: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.easeInOut',
      });

      gsap.to('.ambient-glow-2', {
        y: 30,
        x: -20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.easeInOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-12 lg:py-16 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background motion glowing elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="ambient-glow-1 absolute top-0 right-0 w-[45vw] h-[45vw] bg-accent/10 rounded-full blur-[140px]" />
        <div className="ambient-glow-2 absolute bottom-0 left-0 w-[35vw] h-[35vw] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-accent tracking-[0.25em] uppercase text-xs font-bold mb-4 block">Community Reviews</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Words From Our <span className="text-accent italic font-light">Community</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-white/80 font-semibold text-sm ml-2">4.9/5 Average Rating</span>
          </div>
        </div>

        <div className="testimonial-grid grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="testimonial-card bg-[#111] border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative group hover:border-accent/40 transition-colors duration-500 shadow-2xl"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5 rotate-180 group-hover:text-accent/20 transition-colors duration-500" />

              <div className="flex text-accent mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-10 min-h-[120px] font-light">
                "{item.content}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10"
                />
                <div>
                  <h4 className="text-white font-bold text-base">{item.name}</h4>
                  <p className="text-white/40 text-xs font-medium">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
