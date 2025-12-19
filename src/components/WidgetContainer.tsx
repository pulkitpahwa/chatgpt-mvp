import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Alert } from '@openai/apps-sdk-ui/components/Alert';

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
      className={`bg-background-primary ${modeStyles[displayMode]} ${className}`}
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

export function StatusBanner({ type, message }: StatusBannerProps) {
  // Map our types to Alert color values
  const colorMap: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
    success: 'success',
    error: 'danger',
    warning: 'warning',
    info: 'info',
  };

  return (
    <Alert color={colorMap[type] || 'info'} description={message} />
  );
}
