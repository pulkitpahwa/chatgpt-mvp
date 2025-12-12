import { Tooltip } from '../Tooltip';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  options: FormSelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
  id?: string;
}

export function FormSelect({
  label,
  options,
  value,
  onChange,
  error,
  required,
  placeholder = 'Select an option',
  tooltip,
  disabled,
  id,
}: FormSelectProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="mb-4">
      <label
        htmlFor={selectId}
        className="flex items-center gap-1 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
        {tooltip && <Tooltip content={tooltip} />}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded-lg border appearance-none
          bg-white dark:bg-gray-800
          text-text-primary-light dark:text-text-primary-dark
          border-border-light dark:border-border-dark
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${!value ? 'text-text-secondary-light dark:text-text-secondary-dark' : ''}
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
