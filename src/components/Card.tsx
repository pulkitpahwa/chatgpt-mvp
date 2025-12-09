import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function CardHeader({ title, subtitle, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-4">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div
      className={`text-text-primary-light dark:text-text-primary-dark ${className}`}
    >
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div
      className={`flex items-center gap-3 mt-4 pt-4 border-t border-border-light dark:border-border-dark ${className}`}
    >
      {children}
    </div>
  );
}
