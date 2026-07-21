import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-error/5 flex items-center justify-center mb-5"
      >
        <AlertTriangle className="w-9 h-9 text-error/70" />
      </motion.div>
      <h3 className="text-lg font-semibold text-primary mb-1.5">Oops!</h3>
      <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;
