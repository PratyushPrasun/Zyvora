import { PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description = '',
  action,
  actionLabel = 'Get Started',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-accent/5 flex items-center justify-center mb-5"
      >
        <Icon className="w-9 h-9 text-accent/60" />
      </motion.div>
      <h3 className="text-lg font-semibold text-primary mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      )}
      {action && (
        <Button variant="secondary" size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
