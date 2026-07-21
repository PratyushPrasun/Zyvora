import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-sm hover:shadow-md',
  secondary:
    'bg-transparent text-primary border border-primary/20 hover:bg-primary hover:text-white hover:border-primary',
  accent: 'bg-accent text-white hover:bg-accent-dark active:bg-accent-dark shadow-sm shadow-accent/20 hover:shadow-accent/30',
  ghost: 'bg-transparent text-primary hover:bg-surface-dark',
  danger: 'bg-error text-white hover:bg-red-600 shadow-sm shadow-error/20',
  outline:
    'bg-transparent text-primary border border-border hover:border-accent hover:text-accent',
  glow: 'bg-accent text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:bg-accent-dark',
};

const sizes = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-sm gap-2',
  xl: 'px-10 py-4 text-base gap-2.5',
  icon: 'p-2.5',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.975 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-xl
          transition-all duration-300 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
