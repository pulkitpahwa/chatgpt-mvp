import React from 'react';
import { Tooltip } from '../Tooltip';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  tooltip?: string;
}

export function FormInput({
  label,
  error,
  required,
  tooltip,
  id,
  className = '',
  ...props
}: FormInputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="flex items-center gap-1 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
        {tooltip && <Tooltip content={tooltip} />}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-gray-800
          text-text-primary-light dark:text-text-primary-dark
          placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark
          border-border-light dark:border-border-dark
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
