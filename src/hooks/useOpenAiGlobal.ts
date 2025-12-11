import { useSyncExternalStore } from 'react';
import type { OpenAiGlobals } from '../types/openai';

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
export function useTheme() {
  return useOpenAiGlobal('theme') ?? 'light';
}

/**
 * Hook to get the current display mode
 */
export function useDisplayMode() {
  return useOpenAiGlobal('displayMode') ?? 'inline';
}

/**
 * Hook to get the tool output data from ChatGPT
 */
export function useToolOutput() {
  return useOpenAiGlobal('toolOutput');
}

/**
 * Hook to get the tool input data
 */
export function useToolInput() {
  return useOpenAiGlobal('toolInput');
}

/**
 * Hook to get the persisted widget state
 */
export function useWidgetState() {
  return useOpenAiGlobal('widgetState');
}

/**
 * Hook to get the user's locale
 */
export function useLocale() {
  return useOpenAiGlobal('locale') ?? 'en-US';
}

/**
 * Hook to get the authenticated user info from tool output
 */
export function useUserInfo() {
  const toolOutput = useToolOutput();
  return toolOutput?.structuredContent?.user ?? null;
}
