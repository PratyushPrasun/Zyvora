import Rating from '@/components/ui/Rating';
import { CheckCircle, Trash2 } from 'lucide-react';

const ReviewCard = ({ review, onDelete, isOwner }) => {
  return (
    <div className="border-b border-border/60 pb-6 last:border-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                {review.user?.name || 'Anonymous'}
              </span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-xs text-accent font-medium">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <Rating value={review.rating} size="sm" />
          </div>
        </div>
        {isOwner && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-muted hover:text-error transition-all duration-200 rounded-xl hover:bg-error/5"
            aria-label="Delete review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {review.title && (
        <h4 className="font-medium text-primary mt-3 text-sm">{review.title}</h4>
      )}
      <p className="text-sm text-muted mt-1.5 leading-relaxed">{review.comment}</p>
      <p className="text-xs text-muted-light mt-2.5">
        {new Date(review.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </p>
    </div>
  );
};

export default ReviewCard;
