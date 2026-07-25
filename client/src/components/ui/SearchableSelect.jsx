import { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

const SearchableSelect = forwardRef(
  (
    {
      label,
      options = [],
      value = '',
      onChange,
      placeholder = 'Select an option...',
      error,
      disabled = false,
      name,
      className = '',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Normalize options to array of strings
    const normalizedOptions = options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    // Handle outside click
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen]);

    const filteredOptions = normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    const handleSelect = (val) => {
      if (onChange) {
        onChange(val);
      }
      setIsOpen(false);
      setSearchTerm('');
    };

    return (
      <div className={`w-full relative ${className}`} ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-primary mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            ref={ref}
            name={name}
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`
              w-full px-4 py-3 text-left bg-white border rounded-xl
              text-sm transition-all duration-300 flex items-center justify-between
              focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
              hover:border-border-dark disabled:opacity-50 disabled:bg-surface
              ${error ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'}
            `}
          >
            <span className={selectedOption ? 'text-primary font-medium' : 'text-muted-light'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-light transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-accent' : ''
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl border border-border/80 shadow-xl p-2 animate-in fade-in-50 zoom-in-95 duration-150">
              {/* Search box */}
              <div className="relative mb-2 px-1 pt-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-9 pr-8 py-2 bg-surface/60 border border-border/60 rounded-xl text-xs text-primary placeholder:text-muted-light focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-light hover:text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Options list */}
              <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-muted">
                    No matching categories found
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`
                          w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between
                          transition-colors duration-150
                          ${
                            isSelected
                              ? 'bg-accent/10 text-accent font-semibold'
                              : 'text-primary hover:bg-surface-dark hover:text-accent'
                          }
                        `}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-accent" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
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

SearchableSelect.displayName = 'SearchableSelect';
export default SearchableSelect;
