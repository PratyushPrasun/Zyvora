import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    e.target.reset();
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Zyvora</title>
      </Helmet>

      <div className="bg-surface min-h-screen pb-20">
        <div className="bg-white border-b border-border/60 pb-8 pt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <Container className="relative z-10">
            <Breadcrumb items={[{ label: 'Contact' }]} />
          </Container>
        </div>

        <Container className="py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary mb-6 tracking-tight">
                Let's Start a <span className="text-accent italic font-light">Conversation</span>
              </h1>
              <p className="text-lg text-muted max-w-2xl mx-auto font-light">
                Whether you have a question about an order, need styling advice, or want to provide feedback, our concierge team is here to assist you.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email Support', value: 'concierge@zyvora.com', desc: 'Expect a reply within 24 hours' },
                  { icon: Phone, label: 'Phone', value: '+91 98765 43210', desc: 'Mon-Fri, 9am to 6pm IST' },
                  { icon: MapPin, label: 'Boutique', value: 'Mumbai, India', desc: 'Visit our flagship store' },
                ].map((info, i) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-5 p-6 rounded-3xl bg-white border border-border/60 shadow-sm hover:border-accent/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                      <info.icon className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-primary mb-1">
                        {info.label}
                      </p>
                      <p className="text-sm font-medium text-primary mb-1">{info.value}</p>
                      <p className="text-xs text-muted">{info.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-border/60 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/60">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-primary">Send a Message</h2>
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
                      <label className="block text-sm font-medium text-primary mb-2">
                        Message Details
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Please provide as much detail as possible..."
                        required
                        className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border-dark transition-all duration-300 resize-none"
                      />
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button type="submit" size="xl" variant="glow" className="min-w-[200px]">
                        Send Message
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Contact;
