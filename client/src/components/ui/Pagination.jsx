import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) pages.push(1, '...');
    else pages.push(1);

    pages.push(...range);

    if (range[range.length - 1] < totalPages - 1) pages.push('...', totalPages);
    else if (totalPages > 1) pages.push(totalPages);

    return [...new Set(pages)];
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl hover:bg-surface-dark transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-muted-light select-none">
            ···
          </span>
        ) : (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? 'bg-accent text-white shadow-sm shadow-accent/20'
                : 'hover:bg-surface-dark text-muted'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </motion.button>
        )
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl hover:bg-surface-dark transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </nav>
  );
};

export default Pagination;
