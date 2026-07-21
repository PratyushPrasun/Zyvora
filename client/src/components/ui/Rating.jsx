import { Star } from 'lucide-react';

const Rating = ({ value = 0, onChange, max = 5, size = 'md', showValue = false, count }) => {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(i + 1)}
            className={`${interactive ? 'cursor-pointer hover:scale-125 transition-all duration-200' : 'cursor-default'}`}
            aria-label={`Rate ${i + 1} stars`}
          >
            <Star
              className={`${sizes[size]} transition-colors duration-200 ${
                i < Math.floor(value)
                  ? 'fill-amber-400 text-amber-400'
                  : i < value
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'fill-surface-darker text-surface-darker'
              }`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-primary">{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-sm text-muted">({count})</span>
      )}
    </div>
  );
};

export default Rating;
