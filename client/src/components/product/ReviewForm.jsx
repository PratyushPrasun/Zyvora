import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Rating from '@/components/ui/Rating';
import { useState } from 'react';

const reviewSchema = z.object({
  title: z.string().max(100, 'Title too long').optional(),
  comment: z.string().min(1, 'Comment is required').max(1000, 'Comment too long'),
});

const ReviewForm = ({ onSubmit, loading }) => {
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const onFormSubmit = (data) => {
    if (rating === 0) return;
    onSubmit({ ...data, rating }, () => {
      reset();
      setRating(0);
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary mb-2">Rating</label>
        <Rating value={rating} onChange={setRating} size="lg" />
        {rating === 0 && (
          <p className="text-xs text-error mt-1.5">Please select a rating</p>
        )}
      </div>

      <Input
        label="Title (Optional)"
        placeholder="Summarize your experience"
        {...register('title')}
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Comment</label>
        <textarea
          rows={4}
          placeholder="Share your thoughts about this product..."
          {...register('comment')}
          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-primary placeholder:text-muted-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border-dark resize-none"
        />
        {errors.comment && (
          <p className="mt-1.5 text-xs text-error">{errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" loading={loading} disabled={rating === 0} variant="accent">
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
