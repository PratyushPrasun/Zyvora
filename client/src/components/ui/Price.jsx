const Price = ({ amount, original, className = '', size = 'md' }) => {
  const formatted = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const discount = original
    ? Math.round(((original - amount) / original) * 100)
    : 0;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className={`font-semibold text-primary ${sizes[size]}`}>
        {formatted(amount)}
      </span>
      {original && original > amount && (
        <>
          <span className="text-sm text-muted-light line-through">
            {formatted(original)}
          </span>
          <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
};

export default Price;
