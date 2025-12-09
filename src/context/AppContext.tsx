import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTheme, useDisplayMode, useToolOutput } from '../hooks/useOpenAiGlobal';
import type { DisplayMode, Theme, ToolOutput } from '../types/openai';

interface AppContextValue {
  theme: Theme;
  displayMode: DisplayMode;
  toolOutput: ToolOutput | undefined;
  isOpenAiAvailable: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const theme = useTheme();
  const displayMode = useDisplayMode();
  const toolOutput = useToolOutput();
  const [isOpenAiAvailable, setIsOpenAiAvailable] = useState(false);

  // Check if window.openai is available
  useEffect(() => {
    const checkOpenAi = () => {
      setIsOpenAiAvailable(!!window.openai);
    };

    checkOpenAi();

    // Also listen for when it becomes available
    const interval = setInterval(checkOpenAi, 100);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Apply display mode class
  useEffect(() => {
    document.body.classList.remove('widget-inline', 'widget-fullscreen');
    if (displayMode === 'inline') {
      document.body.classList.add('widget-inline');
    } else if (displayMode === 'fullscreen') {
      document.body.classList.add('widget-fullscreen');
    }
  }, [displayMode]);

  const value: AppContextValue = {
    theme,
    displayMode,
    toolOutput,
    isOpenAiAvailable,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
