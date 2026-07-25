import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Container from '@/components/ui/Container';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="py-8 lg:py-12 bg-white relative overflow-hidden">
      <Container>
        <div className="max-w-4xl mx-auto bg-[#f8f8f8] rounded-[3rem] p-12 sm:p-16 lg:p-24 relative overflow-hidden border border-black/5">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-6 block">Join the Club</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary mb-6">
              Exclusive <span className="italic font-light">Access</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-lg mb-12">
              Subscribe to our newsletter to receive early access to new collections, exclusive events, and curated editorial content.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md relative group">
              <div 
                className={`relative flex items-center border-b ${
                  isFocused ? 'border-primary' : 'border-black/20'
                } transition-colors duration-500`}
              >
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent py-4 text-primary placeholder:text-muted-foreground/60 focus:outline-none font-medium pr-12"
                  required
                />
                
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <motion.button
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      type="submit"
                      className={`absolute right-0 p-2 text-primary hover:text-accent transition-colors ${
                        email ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.div 
                className="absolute -bottom-6 left-0 right-0 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isSubmitted ? 1 : 0, y: isSubmitted ? 0 : 10 }}
              >
                <span className="text-sm font-medium text-accent">Welcome to the club.</span>
              </motion.div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
