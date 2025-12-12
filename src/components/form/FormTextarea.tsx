import React from 'react';
import { Tooltip } from '../Tooltip';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  tooltip?: string;
}

export function FormTextarea({
  label,
  error,
  required,
  tooltip,
  id,
  className = '',
  rows = 4,
  ...props
}: FormTextareaProps) {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="mb-4">
      <label
        htmlFor={textareaId}
        className="flex items-center gap-1 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
        {tooltip && <Tooltip content={tooltip} />}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        className={`
          w-full px-3 py-2 rounded-lg border resize-y
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
