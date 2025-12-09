import { useState, useCallback } from 'react';

interface UseToolCallResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  callTool: (args?: Record<string, unknown>) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook to call MCP tools via window.openai.callTool
 *
 * @param toolName - The name of the MCP tool to call
 * @returns Object with data, loading state, error, and callTool function
 */
export function useToolCall<T = unknown>(
  toolName: string
): UseToolCallResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callTool = useCallback(
    async (args?: Record<string, unknown>): Promise<T | null> => {
      if (!window.openai?.callTool) {
        const err = new Error('window.openai.callTool is not available');
        setError(err);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = (await window.openai.callTool(toolName, args)) as T;
        setData(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Tool call failed');
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toolName]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, callTool, reset };
}

// Typed hooks for specific MCP tools

export interface ConsultationResponse {
  success: boolean;
  requestId?: string;
  message?: string;
  paymentUrl?: string;
}

export function useRequestConsultation() {
  return useToolCall<ConsultationResponse>(
    'request_consultation_api_request_consultation_post'
  );
}

export interface FinalizationResponse {
  success: boolean;
  requestId?: string;
  message?: string;
  paymentUrl?: string;
}

export function useRequestFinalization() {
  return useToolCall<FinalizationResponse>(
    'request_finalization_api_request_finalization_post'
  );
}

export interface MSADraftResponse {
  success: boolean;
  chatId?: string;
  googleDocId?: string;
  draftContent?: string;
  warnings?: string[];
  paymentUrl?: string;
  isLocked?: boolean;
}

export function useDraftMSA() {
  return useToolCall<MSADraftResponse>('draft_msa_api_draft_msa_post');
}

/**
 * Helper to request display mode change
 */
export async function requestDisplayMode(
  mode: 'inline' | 'fullscreen' | 'pip'
): Promise<boolean> {
  if (!window.openai?.requestDisplayMode) {
    console.warn('window.openai.requestDisplayMode is not available');
    return false;
  }
  return window.openai.requestDisplayMode({ mode });
}

/**
 * Helper to update widget state
 */
export function setWidgetState(state: Record<string, unknown>): void {
  if (!window.openai?.setWidgetState) {
    console.warn('window.openai.setWidgetState is not available');
    return;
  }
  window.openai.setWidgetState(state);
}

/**
 * Helper to send a follow-up message to ChatGPT
 */
export async function sendFollowUpMessage(prompt: string): Promise<void> {
  if (!window.openai?.sendFollowUpMessage) {
    console.warn('window.openai.sendFollowUpMessage is not available');
    return;
  }
  return window.openai.sendFollowUpMessage({ prompt });
}

/**
 * Helper to close the widget
 */
export function requestClose(): void {
  if (!window.openai?.requestClose) {
    console.warn('window.openai.requestClose is not available');
    return;
  }
  window.openai.requestClose();
}

/**
 * Helper to open external URL
 */
export function openExternal(href: string): void {
  if (!window.openai?.openExternal) {
    console.warn('window.openai.openExternal is not available');
    window.open(href, '_blank');
    return;
  }
  window.openai.openExternal({ href });
}
