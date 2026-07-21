import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(
  (
    {
      label,
      error,
      type = 'text',
      icon: Icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light group-focus-within:text-accent transition-colors duration-200" />
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            className={`
              w-full px-4 py-3
              bg-white border rounded-xl
              text-sm text-primary placeholder:text-muted-light
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
              hover:border-border-dark
              disabled:opacity-50 disabled:bg-surface
              ${Icon ? 'pl-11' : ''}
              ${isPassword ? 'pr-11' : ''}
              ${error ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'}
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-light hover:text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
