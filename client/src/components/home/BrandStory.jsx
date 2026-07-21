import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const BrandStory = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.story-text > *', {
        scrollTrigger: {
          trigger: '.story-text',
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.story-image', {
        scrollTrigger: {
          trigger: '.story-image-container',
          start: 'top 80%',
        },
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 lg:py-40 bg-[#f4f4f4] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="story-image-container relative h-[60vh] lg:h-[80vh] w-full rounded-[2rem] overflow-hidden order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop" 
              alt="Brand Story" 
              className="story-image w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          </div>

          <div className="story-text order-1 lg:order-2 flex flex-col items-start max-w-xl">
            <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-6">Our Philosophy</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary mb-8 leading-[1.1]">
              Redefining <br/>
              <span className="text-muted-foreground italic font-light">Modern Luxury</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
              Zyvora was born from a simple desire: to curate exceptional products that seamlessly blend aesthetic brilliance with uncompromising quality. We believe that true luxury isn't just about labels—it's about the feeling a product evokes and the story it tells.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-12">
              Every item in our collection is meticulously selected to ensure it meets our rigorous standards of craftsmanship and design. We are not just a marketplace; we are curators of a lifestyle.
            </p>
            
            <Link to="/about" className="group flex items-center gap-4 text-primary font-medium tracking-wide uppercase text-sm border-b border-primary/20 pb-2 hover:border-primary transition-colors">
              Read Our Full Story 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BrandStory;
