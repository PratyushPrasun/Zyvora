import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';

const stats = [
  { number: 10, suffix: 'K+', label: 'Happy Customers' },
  { number: 500, suffix: '+', label: 'Premium Products' },
  { number: 99, suffix: '%', label: 'Satisfaction Rate' },
];

const About = () => {
  const statsRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation
      countersRef.current.forEach((counter, i) => {
        if (!counter) return;
        const target = stats[i].number;
        
        gsap.to(counter, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
          innerHTML: target,
          duration: 2.5,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          onUpdate: function() {
            counter.innerHTML = Math.round(this.targets()[0].innerHTML) + stats[i].suffix;
          }
        });
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Story — Zyvora</title>
      </Helmet>

      <div className="bg-surface min-h-screen pb-20">
        <div className="bg-white border-b border-border/60 pb-8 pt-8">
          <Container>
            <Breadcrumb items={[{ label: 'Our Story' }]} />
          </Container>
        </div>

        <Container className="py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-20"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-primary tracking-tight mb-8">
                Defining <span className="text-accent italic font-light">Elegance</span>
              </h1>
              <p className="text-xl text-muted leading-relaxed max-w-2xl mx-auto font-light">
                Zyvora was born from a simple belief: everyone deserves access to
                exceptional products that combine beauty, uncompromised quality, and purpose.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="rounded-3xl overflow-hidden aspect-[4/5] bg-surface-dark relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" 
                  alt="Our boutique" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-display font-bold text-primary mb-4">Curated Excellence</h3>
                  <p className="text-muted leading-relaxed font-light text-lg">
                    We curate a collection of premium products from around the world, each
                    selected for its craftsmanship, design, and value. Our team obsesses
                    over every detail — from sourcing to packaging — to deliver an
                    experience that goes beyond the ordinary.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-2xl font-display font-bold text-primary mb-4">Intentional Living</h3>
                  <p className="text-muted leading-relaxed font-light text-lg">
                    At Zyvora, we believe that the things you surround yourself with
                    should inspire you. That's why we partner with artisans and brands who
                    share our commitment to excellence, sustainability, and innovation.
                  </p>
                </motion.div>
              </div>
            </div>

            <div ref={statsRef} className="bg-white rounded-3xl p-12 border border-border/60 shadow-xl shadow-black/[0.02]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
                {stats.map((stat, index) => (
                  <div key={stat.label}>
                    <p 
                      ref={el => countersRef.current[index] = el}
                      className="text-5xl sm:text-6xl font-display font-bold text-accent mb-2"
                    >
                      0{stat.suffix}
                    </p>
                    <p className="text-sm font-medium text-primary uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default About;
