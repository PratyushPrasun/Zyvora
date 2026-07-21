const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`rounded-xl skeleton-shimmer ${className}`}
    {...props}
  />
);

Skeleton.Text = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2.5 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        style={{ width: i === lines - 1 ? '55%' : i === 0 ? '100%' : '85%' }}
      />
    ))}
  </div>
);

Skeleton.Card = ({ className = '' }) => (
  <div className={`space-y-3.5 ${className}`}>
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <Skeleton className="h-3 w-1/3 rounded-lg" />
    <Skeleton className="h-4 w-3/4 rounded-lg" />
    <Skeleton className="h-3 w-1/2 rounded-lg" />
    <Skeleton className="h-5 w-1/3 rounded-lg" />
  </div>
);

Skeleton.Table = ({ rows = 5, cols = 4, className = '' }) => (
  <div className={`space-y-2.5 ${className}`}>
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-10 rounded-xl" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-14 rounded-xl" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
