import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTheme, useDisplayMode, useToolOutput, useIsOpenAiAvailable } from '../hooks/useOpenAiGlobal';
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
  const isOpenAiAvailable = useIsOpenAiAvailable();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // Determine loading states
  const isLoading = !initialCheckComplete;
  const isWaitingForBackend = isOpenAiAvailable && !hasBackendResponse(toolOutput);

  // Check for window.openai availability or set up mock for local testing
  useEffect(() => {
    // Check for mock_intent in URL (for local testing)
    const urlParams = new URLSearchParams(window.location.search);
    const mockIntent = urlParams.get('mock_intent');

    if (mockIntent && !window.openai) {
      console.log('[AppContext] Setting up mock window.openai with intent:', mockIntent);
      window.openai = {
        theme: 'light',
        locale: 'en-US',
        displayMode: 'inline',
        userAgent: '',
        maxHeight: 600,
        safeArea: { top: 0, right: 0, bottom: 0, left: 0 },
        toolInput: {},
        toolResponseMetadata: {},
        widgetState: {},
        toolOutput: {
          intent: mockIntent as 'consultation' | 'personal_injury',
          structuredContent: {
            intent: mockIntent as 'consultation' | 'personal_injury',
            status: 'selection',
            message: `Test mode: showing ${mockIntent} page`,
          },
        },
        callTool: async () => ({ content: [], structuredContent: undefined }),
        sendFollowUpMessage: async () => {},
        requestDisplayMode: async () => true,
        setWidgetState: () => {},
        requestClose: () => {},
        openExternal: () => {},
        uploadFile: async () => ({ fileId: 'mock-file-id' }),
        getFileDownloadUrl: async () => ({ url: '', expiresAt: '' }),
      };
      // Dispatch event so hooks pick up the change
      window.dispatchEvent(new Event('openai:set_globals'));
    }

    // Complete initial check after a short delay
    const timeout = setTimeout(() => {
      setInitialCheckComplete(true);
    }, window.openai ? 0 : 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Apply theme to document for dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
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
