import React from 'react';

interface RadioTileOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioTileProps {
  options: RadioTileOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  columns?: 1 | 2;
}

export function RadioTile({
  options,
  value,
  onChange,
  name,
  columns = 2,
}: RadioTileProps) {
  return (
    <div
      className={`grid gap-3 ${
        columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
      }`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${isSelected
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-border-light dark:border-border-dark hover:border-primary/50 bg-white dark:bg-gray-800'
              }
            `}
            role="radio"
            aria-checked={isSelected}
            aria-label={option.label}
          >
            <div className="flex flex-col items-center text-center gap-2">
              {option.icon && (
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-100 dark:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark'
                    }
                  `}
                >
                  {option.icon}
                </div>
              )}
              <div>
                <p
                  className={`
                    font-medium
                    ${isSelected
                      ? 'text-primary'
                      : 'text-text-primary-light dark:text-text-primary-dark'
                    }
                  `}
                >
                  {option.label}
                </p>
                {option.description && (
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </div>

            {/* Hidden radio input for form semantics */}
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
          </button>
        );
      })}
    </div>
  );
}
