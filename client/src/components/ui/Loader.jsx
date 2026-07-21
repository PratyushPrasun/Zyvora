import { motion } from 'framer-motion';

const Loader = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'gap-1.5', md: 'gap-2', lg: 'gap-2.5' };
  const dotSizes = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' };

  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className={`flex items-center ${sizes[size]}`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`${dotSizes[size]} rounded-full bg-accent`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
