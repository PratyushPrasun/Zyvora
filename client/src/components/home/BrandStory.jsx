import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const STORY_TEXT_1 = "Zyvora was born from a simple desire: to curate exceptional products that seamlessly blend aesthetic brilliance with uncompromising quality.";
const STORY_TEXT_2 = "Every item in our collection is meticulously selected to ensure it meets our rigorous standards of craftsmanship and design. We are not just a marketplace; we are curators of a refined lifestyle.";

const BrandStory = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Scroll-driven text fill effect for words
      const words = textContainerRef.current?.querySelectorAll('.scroll-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { color: 'rgba(15, 23, 42, 0.15)' },
          {
            color: 'rgba(15, 23, 42, 1)',
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: 'top 75%',
              end: 'bottom 45%',
              scrub: 0.5,
            },
          }
        );
      }

      // 2. Parallax scale and position on the story image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.15, y: -20 },
          {
            scale: 1,
            y: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper to wrap words in spans for GSAP target
  const renderScrollableWords = (text) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="scroll-word inline-block mr-[0.3em] transition-colors duration-200">
        {word}
      </span>
    ));
  };

  return (
    <section ref={containerRef} className="py-8 lg:py-16 bg-[#f8f9fa] relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-black/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative h-[55vh] lg:h-[75vh] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 border border-black/5">
              <img
                ref={imageRef}
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop"
                alt="Brand Philosophy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
              
              {/* Badge on Image */}
              <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/40 shadow-lg flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Uncompromising Quality</p>
                  <p className="text-[11px] text-muted font-medium">Curated with Passion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Column with Scroll-Linked Fade */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-bold tracking-[0.25em] uppercase mb-6 bg-accent/10 px-4 py-2 rounded-full w-max border border-accent/20">
              Our Philosophy
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary mb-10 leading-[1.15] tracking-tight">
              Redefining <br />
              <span className="text-accent italic font-light">Modern Luxury</span>
            </h2>

            <div ref={textContainerRef} className="space-y-6 text-xl sm:text-2xl font-display font-medium leading-relaxed mb-12">
              <p>{renderScrollableWords(STORY_TEXT_1)}</p>
              <p className="text-lg sm:text-xl font-sans font-light leading-relaxed">{renderScrollableWords(STORY_TEXT_2)}</p>
            </div>

            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-4 text-primary font-bold tracking-wider uppercase text-sm border-b-2 border-primary/20 pb-2 hover:border-accent hover:text-accent transition-all duration-300 group"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BrandStory;
