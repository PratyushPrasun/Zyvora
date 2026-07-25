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

Skeleton.ProductDetail = ({ className = '' }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 ${className}`}>
    {/* Image gallery */}
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-20 rounded-xl" />
        ))}
      </div>
    </div>
    {/* Product info */}
    <div className="space-y-6 py-6">
      <Skeleton className="h-4 w-24 rounded-lg" />
      <Skeleton className="h-10 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-1/3 rounded-lg" />
      <Skeleton className="h-8 w-32 rounded-lg" />
      <Skeleton.Text lines={3} />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-14 w-36 rounded-xl" />
        <Skeleton className="h-14 flex-1 rounded-xl" />
      </div>
      <div className="space-y-3 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

Skeleton.OrderCard = ({ className = '' }) => (
  <div className={`bg-white rounded-3xl border border-border/60 p-6 ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 rounded-lg" />
          <Skeleton className="h-3 w-28 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/40">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="w-12 h-12 rounded-xl" />
      ))}
    </div>
  </div>
);

Skeleton.Profile = ({ className = '' }) => (
  <div className={`bg-white rounded-3xl border border-border/60 p-6 sm:p-10 ${className}`}>
    <div className="flex items-center gap-5 mb-10 pb-8 border-b border-border/60">
      <Skeleton className="w-20 h-20 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-36 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded-lg" />
      </div>
    </div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-2xl" />
      ))}
    </div>
  </div>
);

export default Skeleton;
