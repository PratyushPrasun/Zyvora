import { Star, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewCard = ({ review, isOwner, onDelete }) => {
  const initial = review.user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 border-b border-border/60 last:border-0 last:pb-0 first:pt-0 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15 shrink-0">
            <span className="text-sm font-semibold text-accent-dark">{initial}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-primary">{review.user?.name || 'Anonymous'}</p>
              <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-px rounded-full font-medium">
                Verified
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-surface-darker text-surface-darker'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : ''}
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="p-2 text-muted hover:text-error rounded-xl hover:bg-error/5 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Delete review"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {review.comment && (
        <p className="text-sm text-muted leading-relaxed mt-3 ml-[52px]">
          {review.comment}
        </p>
      )}
    </motion.div>
  );
};

export default ReviewCard;
