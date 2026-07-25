import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Send,
  Plus,
  Minus,
  MapPinned,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────
const CONTACT_METHODS = [
  {
    icon: Mail,
    label: 'Email Support',
    value: 'concierge@zyvora.com',
    desc: 'Expect a reply within 24 hours',
    accent: 'We respond to every email personally.',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    desc: 'Mon-Fri, 9am to 6pm IST',
    accent: 'Speak directly with our concierge team.',
  },
  {
    icon: MapPin,
    label: 'Boutique',
    value: 'Mumbai, India',
    desc: 'Visit our flagship store',
    accent: 'Experience Zyvora in person.',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon — Fri, 9 AM — 6 PM',
    desc: 'IST (UTC+5:30)',
    accent: 'Weekend support via email.',
  },
];

const FAQ_DATA = [
  {
    question: 'What are your shipping options?',
    answer:
      'We offer standard (5-7 business days), express (2-3 business days), and overnight shipping options. Free standard shipping is available on orders over ₹2,000. All orders include real-time tracking and premium packaging.',
  },
  {
    question: 'How do I return or exchange a product?',
    answer:
      'We offer a hassle-free 30-day return policy. Simply initiate a return from your order dashboard, and we\'ll arrange a free pickup. Refunds are processed within 5-7 business days once we receive the item.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, Amex), UPI, net banking, and popular wallets. All transactions are secured with 256-bit SSL encryption.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you\'ll receive a tracking link via email and SMS. You can also track your order in real-time from your Zyvora account dashboard under "My Orders."',
  },
  {
    question: 'How quickly will I receive a response?',
    answer:
      'Our concierge team typically responds to emails within 12-24 hours. Phone support is available during business hours (Mon-Fri, 9 AM — 6 PM IST). For urgent inquiries, phone is the fastest option.',
  },
];

// ─── FAQ Accordion Item ──────────────────────────────────────
const FAQItem = ({ item, isOpen, onToggle }) => {
  return (
    <motion.div
      initial={false}
      className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
        isOpen ? 'border-accent/30 bg-accent/[0.02]' : 'border-border/60 bg-white'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className={`text-base font-semibold transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-primary'}`}>
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-4 transition-colors duration-300 ${
            isOpen
              ? 'bg-accent text-white'
              : 'bg-surface border border-border/60 text-muted group-hover:border-accent/30 group-hover:text-accent'
          }`}
        >
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <p className="text-muted font-light text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Component ───────────────────────────────────────────────
const Contact = () => {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(null);

  // Preserve exact existing handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    e.target.reset();
  };

  // GSAP Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.contact-badge-reveal', { opacity: 0, y: 15, duration: 0.8 })
        .from('.contact-title-reveal', { opacity: 0, y: 25, duration: 1 }, '-=0.5')
        .from('.contact-desc-reveal', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
        .from('.contact-breadcrumb-reveal', { opacity: 0, y: 10, duration: 0.6 }, '-=0.5');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // GSAP scroll reveals for sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.contact-section-reveal').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Zyvora</title>
        <meta
          name="description"
          content="Get in touch with Zyvora's concierge team. We're here to assist with orders, styling advice, and any questions."
        />
      </Helmet>

      {/* ───── Premium Dark Hero ───── */}
      <section
        ref={heroRef}
        className="relative min-h-[55vh] lg:min-h-[65vh] flex items-center justify-center bg-[#050505] overflow-hidden"
      >
        <div className="hero-grain" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[50vw] h-[50vw] max-w-[550px] max-h-[550px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        </div>

        {/* Background marquee */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none opacity-20">
          <div className="hero-marquee-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="text-[14vw] sm:text-[10vw] font-display font-extrabold text-white/[0.03] uppercase tracking-[0.25em] px-8 select-none whitespace-nowrap"
              >
                GET IN TOUCH
              </span>
            ))}
          </div>
        </div>

        <Container className="relative z-10 text-center py-20 sm:py-28 lg:py-32">
          <div className="contact-breadcrumb-reveal mb-8">
            <Breadcrumb items={[{ label: 'Contact' }]} />
          </div>

          <div className="contact-badge-reveal mb-6">
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
              <Sparkles className="w-3.5 h-3.5" />
              Concierge Service
            </span>
          </div>

          <h1 className="contact-title-reveal text-5xl sm:text-6xl lg:text-8xl font-display font-bold text-white tracking-tight mb-6 leading-[1.05]">
            Let's Start a{' '}
            <span className="text-gradient-green italic font-light">Conversation</span>
          </h1>

          <p className="contact-desc-reveal text-base sm:text-lg lg:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
            Whether you have a question about an order, need styling advice, or want to
            provide feedback, our concierge team is here to assist you.
          </p>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-12 flex flex-col items-center text-white/30"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Container>
      </section>

      {/* ───── Contact Methods ───── */}
      <section className="bg-white py-20 sm:py-24 contact-section-reveal">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              Reach Out
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight mb-4">
              Multiple Ways to{' '}
              <span className="italic font-light text-accent">Connect</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_METHODS.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="relative p-6 rounded-2xl bg-white border border-border/60 shadow-sm hover:border-accent/30 hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border/60 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
                    <info.icon className="w-5 h-5 text-muted group-hover:text-white transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-bold text-primary mb-1">{info.label}</p>
                  <p className="text-base font-medium text-primary mb-1">{info.value}</p>
                  <p className="text-xs text-muted font-light mb-3">{info.desc}</p>
                  <p className="text-xs text-accent/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {info.accent}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── Contact Form ───── */}
      <section ref={formRef} className="bg-surface py-20 sm:py-24 relative overflow-hidden contact-section-reveal">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                Send a Message
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight mb-4">
                We'd Love to{' '}
                <span className="italic font-light text-accent">Hear</span> From You
              </h2>
              <p className="text-muted font-light text-lg max-w-lg mx-auto">
                Fill out the form below and our concierge team will get back to you within a few hours.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 border border-border/60 shadow-sm relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/60">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-primary">
                    Contact Form
                  </h3>
                  <p className="text-sm text-muted font-light mt-0.5">
                    We typically reply within a few hours.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Full Name" placeholder="John Doe" required />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <Input label="Subject" placeholder="How can we assist you?" required />
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Message Details
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Please provide as much detail as possible..."
                    required
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border-dark transition-all duration-300 resize-none text-primary input-focus-glow"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="xl" variant="glow" className="min-w-[200px] rounded-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ───── FAQ Section ───── */}
      <section className="bg-white py-20 sm:py-24 contact-section-reveal">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                Common Questions
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight mb-4">
                Frequently{' '}
                <span className="italic font-light text-accent">Asked</span>
              </h2>
              <p className="text-muted font-light text-lg max-w-lg mx-auto">
                Quick answers to common questions. Can't find what you need? Reach out to us directly.
              </p>
            </motion.div>

            <div className="space-y-3">
              {FAQ_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <FAQItem
                    item={item}
                    isOpen={openFAQ === index}
                    onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ───── Location Section ───── */}
      <section className="bg-surface py-20 sm:py-24 contact-section-reveal">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                Visit Us
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight">
                Our{' '}
                <span className="italic font-light text-accent">Flagship</span>{' '}
                Store
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden border border-border/60 bg-white shadow-sm"
            >
              {/* Map placeholder — elegant dark card */}
              <div className="relative h-64 sm:h-80 bg-[#0a0a0a] overflow-hidden">
                <div className="hero-grain" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0%,transparent_60%)]" />

                {/* Decorative grid pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Center pin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mb-2">
                      <MapPinned className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-white/80 text-sm font-display font-bold">
                      Mumbai, India
                    </span>
                    <span className="text-white/40 text-xs font-light mt-0.5">
                      Flagship Boutique
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Info strip */}
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-display font-bold text-primary mb-1">
                    Zyvora Flagship Boutique
                  </p>
                  <p className="text-sm text-muted font-light">
                    Mumbai, Maharashtra, India
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="font-semibold text-primary">Mon — Fri</p>
                    <p className="text-muted font-light text-xs">9:00 AM — 6:00 PM IST</p>
                  </div>
                  <div className="w-px h-8 bg-border/60" />
                  <div className="text-right">
                    <p className="font-semibold text-primary">Saturday</p>
                    <p className="text-muted font-light text-xs">10:00 AM — 4:00 PM IST</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ───── Closing CTA ───── */}
      <section className="relative bg-[#050505] py-20 sm:py-28 lg:py-32 overflow-hidden">
        <div className="hero-grain" />
        <div className="absolute bottom-0 left-1/3 w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-6 block">
              We're Here to Help
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight mb-6">
              Still Have{' '}
              <span className="italic font-light text-gradient-green">Questions</span>?
            </h2>
            <p className="text-lg text-white/50 font-light mb-10 max-w-xl mx-auto">
              Our concierge team is always happy to help. Don't hesitate to reach out.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-base bg-accent text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:bg-accent-dark transition-all duration-300 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send a Message
              </motion.button>
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full font-medium text-base text-white/80 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 hover:text-white transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default Contact;
