import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTheme, useDisplayMode, useToolOutput } from '../hooks/useOpenAiGlobal';
import type { DisplayMode, Theme, ToolOutput } from '../types/openai';

interface AppContextValue {
  theme: Theme;
  displayMode: DisplayMode;
  toolOutput: ToolOutput | undefined;
  isOpenAiAvailable: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // Check if window.openai is available or set up mock for local testing
  useEffect(() => {
    const checkOpenAi = () => {
      if (window.openai) {
        setIsOpenAiAvailable(true);
        setIsLoading(false);
        return true;
      }
      return false;
    };

    // Check for mock_intent in URL (for local testing)
    const urlParams = new URLSearchParams(window.location.search);
    const mockIntent = urlParams.get('mock_intent');
    if (mockIntent && !window.openai) {
      console.log('[AppContext] Setting up mock window.openai with intent:', mockIntent);
      window.openai = {
        theme: 'light',
        locale: 'en-US',
        displayMode: 'inline',
        toolOutput: {
          intent: mockIntent as 'consultation' | 'msa_draft' | 'finalization' | 'payment',
          status: 'selection',
          user_id: 'test_user',
          message: `Test mode: showing ${mockIntent} page`,
        },
      } as unknown as typeof window.openai;
      // Dispatch event so hooks pick up the change
      window.dispatchEvent(new Event('openai:set_globals'));
    }

    if (checkOpenAi()) return;

    // Also listen for when it becomes available
    const interval = setInterval(checkOpenAi, 100);
    // After 2 seconds, stop loading even if openai isn't available (standalone mode)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
    }, 2000);

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
    isLoading,
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
