import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 — Zyvora</title>
      </Helmet>

      <div className="min-h-[85vh] flex items-center justify-center bg-surface relative overflow-hidden">
        {/* Dramatic background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-4 relative z-10"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-8xl sm:text-9xl lg:text-[12rem] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/20 tracking-tighter leading-none select-none"
          >
            404
          </motion.h1>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mt-6 mb-4 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted mb-10 max-w-md mx-auto text-lg font-light leading-relaxed">
            The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button variant="glow" size="xl">
              <ArrowLeft className="w-5 h-5" />
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
