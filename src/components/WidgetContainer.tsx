import React from 'react';
import { useAppContext } from '../context/AppContext';

interface WidgetContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Container component that adapts to display mode.
 * - Inline: Compact, no scroll, auto-fit height
 * - Fullscreen: Full viewport, scrollable
 * - PiP: Floating window style
 */
export function WidgetContainer({ children, className = '' }: WidgetContainerProps) {
  const { displayMode } = useAppContext();

  const modeStyles = {
    inline: 'max-h-screen overflow-hidden',
    fullscreen: 'min-h-screen p-4',
    pip: 'max-w-sm rounded-xl shadow-lg',
  };

  return (
    <div
      className={`bg-surface-light dark:bg-surface-dark ${modeStyles[displayMode]} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatusBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onDismiss?: () => void;
}

export function StatusBanner({ type, message, onDismiss }: StatusBannerProps) {
  const typeStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  };

  const iconPaths = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${typeStyles[type]}`}
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconPaths[type]}
        />
      </svg>
      <p className="flex-1 text-sm">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Dismiss"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
