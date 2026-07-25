import { motion } from 'framer-motion';

const Badge = ({ children, variant = 'default', className = '', dot = false, size = 'md' }) => {
  const variants = {
    default: 'bg-surface-dark text-primary',
    success: 'bg-accent-muted text-accent-dark',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    accent: 'bg-accent/10 text-accent-dark',
  };

  const sizes = {
    sm: 'px-2 py-px text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const dotColors = {
    success: 'bg-accent',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-info',
    default: 'bg-muted',
    accent: 'bg-accent',
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {(variant === 'success' || variant === 'accent') && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`} />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`} />
        </span>
      )}
      {children}
    </motion.span>
  );
};

export default Badge;
