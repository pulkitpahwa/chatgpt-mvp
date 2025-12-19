import { useSyncExternalStore, useCallback } from 'react';
import type {
  OpenAiGlobals,
  Theme,
  DisplayMode,
  ToolOutput,
  ToolInput,
  WidgetState,
  SafeArea,
  ToolResponseMetadata,
} from '../types/openai';

const SET_GLOBALS_EVENT_TYPE = 'openai:set_globals';

/**
 * Reactive hook to access window.openai globals.
 * Subscribes to changes and re-renders when the specified global value updates.
 *
 * @param key - The key of the global value to access
 * @returns The current value of the specified global
 */
export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K
): OpenAiGlobals[K] | undefined {
  return useSyncExternalStore(
    (onChange) => {
      const handleSetGlobal = () => {
        onChange();
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
      };
    },
    () => window.openai?.[key],
    () => undefined // Server snapshot (for SSR)
  );
}

/**
 * Hook to get the current theme from ChatGPT host
 */
export function useTheme(): Theme {
  return useOpenAiGlobal('theme') ?? 'light';
}

/**
 * Hook to get the current display mode
 */
export function useDisplayMode(): DisplayMode {
  return useOpenAiGlobal('displayMode') ?? 'inline';
}

/**
 * Hook to get the tool output data from ChatGPT
 */
export function useToolOutput(): ToolOutput | undefined {
  return useOpenAiGlobal('toolOutput');
}

/**
 * Hook to get the tool input data
 */
export function useToolInput(): ToolInput | undefined {
  return useOpenAiGlobal('toolInput');
}

/**
 * Hook to get the persisted widget state
 */
export function useWidgetState(): WidgetState | undefined {
  return useOpenAiGlobal('widgetState');
}

/**
 * Hook to get the user's locale (BCP 47 format)
 */
export function useLocale(): string {
  return useOpenAiGlobal('locale') ?? 'en-US';
}

/**
 * Hook to get the user agent hint
 */
export function useUserAgent(): string {
  return useOpenAiGlobal('userAgent') ?? '';
}

/**
 * Hook to get the max height constraint
 */
export function useMaxHeight(): number {
  return useOpenAiGlobal('maxHeight') ?? 0;
}

/**
 * Hook to get the safe area insets
 */
export function useSafeArea(): SafeArea {
  return useOpenAiGlobal('safeArea') ?? { top: 0, right: 0, bottom: 0, left: 0 };
}

/**
 * Hook to get the tool response metadata
 */
export function useToolResponseMetadata(): ToolResponseMetadata | undefined {
  return useOpenAiGlobal('toolResponseMetadata');
}

/**
 * Hook to get the widget session ID from metadata
 */
export function useWidgetSessionId(): string | undefined {
  const metadata = useToolResponseMetadata();
  return metadata?.['openai/widgetSessionId'];
}

/**
 * Hook to get the authenticated user info from tool output
 */
export function useUserInfo() {
  const toolOutput = useToolOutput();
  return toolOutput?.structuredContent?.user ?? null;
}

/**
 * Hook to check if the OpenAI API is available
 */
export function useIsOpenAiAvailable(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const handleSetGlobal = () => onChange();
      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, { passive: true });
      return () => window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
    },
    () => !!window.openai,
    () => false
  );
}

/**
 * Hook to get a function that dispatches global update events
 * Useful for triggering re-renders after state changes
 */
export function useDispatchGlobalUpdate() {
  return useCallback(() => {
    window.dispatchEvent(new Event(SET_GLOBALS_EVENT_TYPE));
  }, []);
}
