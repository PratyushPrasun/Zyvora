import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

const ReviewForm = ({ onSubmit, loading }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment }, () => {
      setRating(0);
      setComment('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-accent" />
        </motion.div>
        <h4 className="font-semibold text-primary mb-1">Thank you!</h4>
        <p className="text-sm text-muted">Your review has been submitted.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">Your Rating</label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 cursor-pointer"
            >
              <Star
                className={`w-6 h-6 transition-all duration-200 ${
                  i < (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-surface-darker text-surface-darker'
                }`}
              />
            </motion.button>
          ))}
          {rating > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium text-primary ml-2"
            >
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </motion.span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">Your Review</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300 resize-none hover:border-border-dark input-focus-glow"
        />
      </div>

      <Button
        type="submit"
        variant="glow"
        size="md"
        fullWidth
        loading={loading}
        disabled={!rating}
      >
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
