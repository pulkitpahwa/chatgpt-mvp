import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTheme, useDisplayMode, useToolOutput } from '../hooks/useOpenAiGlobal';
import type { DisplayMode, Theme, ToolOutput } from '../types/openai';

interface AppContextValue {
  theme: Theme;
  displayMode: DisplayMode;
  toolOutput: ToolOutput | undefined;
  isOpenAiAvailable: boolean;
  isLoading: boolean;
  isWaitingForBackend: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Check if toolOutput has meaningful data from the backend
 */
function hasBackendResponse(toolOutput: ToolOutput | undefined): boolean {
  if (!toolOutput) return false;

  // Check for intent at top level or in structuredContent
  const hasIntent = !!(toolOutput.intent || toolOutput.structuredContent?.intent);

  // Check for any structured content
  const hasStructuredContent = !!(
    toolOutput.structuredContent &&
    Object.keys(toolOutput.structuredContent).length > 0
  );

  // Check for content array
  const hasContent = !!(toolOutput.content && toolOutput.content.length > 0);

  return hasIntent || hasStructuredContent || hasContent;
}

export function AppProvider({ children }: AppProviderProps) {
  const theme = useTheme();
  const displayMode = useDisplayMode();
  const toolOutput = useToolOutput();
  const [isOpenAiAvailable, setIsOpenAiAvailable] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // Determine loading states
  // isLoading: true until we've done initial check for window.openai
  // isWaitingForBackend: window.openai exists but toolOutput doesn't have backend data yet
  const isLoading = !initialCheckComplete;
  const isWaitingForBackend = isOpenAiAvailable && !hasBackendResponse(toolOutput);

  // Check if window.openai is available or set up mock for local testing
  useEffect(() => {
    const checkOpenAi = () => {
      if (window.openai) {
        setIsOpenAiAvailable(true);
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
          structuredContent: {
            intent: mockIntent as 'consultation' | 'msa_draft' | 'finalization' | 'payment',
            status: 'selection',
            message: `Test mode: showing ${mockIntent} page`,
          },
        },
      } as unknown as typeof window.openai;
      // Dispatch event so hooks pick up the change
      window.dispatchEvent(new Event('openai:set_globals'));
    }

    if (checkOpenAi()) {
      setInitialCheckComplete(true);
      return;
    }

    // Also listen for when it becomes available
    const interval = setInterval(() => {
      if (checkOpenAi()) {
        clearInterval(interval);
        setInitialCheckComplete(true);
      }
    }, 100);

    // After 2 seconds, stop checking even if openai isn't available (standalone mode)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setInitialCheckComplete(true);
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
    isWaitingForBackend,
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
