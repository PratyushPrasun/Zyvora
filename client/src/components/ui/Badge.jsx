const Badge = ({ children, variant = 'default', className = '', dot = false }) => {
  const variants = {
    default: 'bg-surface-dark text-primary',
    success: 'bg-accent-muted text-accent-dark',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    accent: 'bg-accent/10 text-accent-dark',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-accent animate-pulse' :
          variant === 'error' ? 'bg-error' :
          variant === 'warning' ? 'bg-warning' :
          variant === 'info' ? 'bg-info' :
          'bg-muted'
        }`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
