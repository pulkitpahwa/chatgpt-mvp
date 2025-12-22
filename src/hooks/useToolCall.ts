import { useState, useCallback } from 'react';
import type { ToolCallResult, DisplayMode, WidgetState } from '../types/openai';

interface UseToolCallResult<T> {
  data: ToolCallResult<T> | null;
  loading: boolean;
  error: Error | null;
  callTool: (args?: Record<string, unknown>) => Promise<ToolCallResult<T> | null>;
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
  const [data, setData] = useState<ToolCallResult<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callTool = useCallback(
    async (args?: Record<string, unknown>): Promise<ToolCallResult<T> | null> => {
      if (!window.openai?.callTool) {
        const err = new Error('window.openai.callTool is not available');
        setError(err);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await window.openai.callTool<T>(toolName, args);
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

export interface ConsultationStructuredContent {
  intent: string;
  status: string;
  message: string;
  requestId?: string;
  paymentUrl?: string;
}


export function useRequestConsultation() {
  return useToolCall<ConsultationStructuredContent>('store_lead');
}

export interface FinalizationStructuredContent {
  success: boolean;
  requestId?: string;
  message?: string;
  paymentUrl?: string;
}

export function useRequestFinalization() {
  return useToolCall<FinalizationStructuredContent>('request_finalization');
}

/**
 * Request display mode change
 */
export async function requestDisplayMode(
  mode: DisplayMode
): Promise<boolean> {
  if (!window.openai?.requestDisplayMode) {
    console.warn('window.openai.requestDisplayMode is not available');
    return false;
  }
  return window.openai.requestDisplayMode({ mode });
}

/**
 * Update widget state (persisted across renders)
 */
export function setWidgetState(state: WidgetState): void {
  if (!window.openai?.setWidgetState) {
    console.warn('window.openai.setWidgetState is not available');
    return;
  }
  window.openai.setWidgetState(state);
}

/**
 * Send a follow-up message to ChatGPT
 */
export async function sendFollowUpMessage(prompt: string): Promise<void> {
  if (!window.openai?.sendFollowUpMessage) {
    console.warn('window.openai.sendFollowUpMessage is not available');
    return;
  }
  return window.openai.sendFollowUpMessage({ prompt });
}

/**
 * Close the widget
 */
export function requestClose(): void {
  if (!window.openai?.requestClose) {
    console.warn('window.openai.requestClose is not available');
    return;
  }
  window.openai.requestClose();
}

/**
 * Open external URL
 */
export function openExternal(href: string): void {
  if (!window.openai?.openExternal) {
    console.warn('window.openai.openExternal is not available');
    window.open(href, '_blank');
    return;
  }
  window.openai.openExternal({ href });
}

/**
 * Upload a file and get its ID
 */
export async function uploadFile(file: File): Promise<string | null> {
  if (!window.openai?.uploadFile) {
    console.warn('window.openai.uploadFile is not available');
    return null;
  }
  const result = await window.openai.uploadFile(file);
  return result.fileId;
}

/**
 * Get a temporary download URL for a file
 */
export async function getFileDownloadUrl(fileId: string): Promise<string | null> {
  if (!window.openai?.getFileDownloadUrl) {
    console.warn('window.openai.getFileDownloadUrl is not available');
    return null;
  }
  const result = await window.openai.getFileDownloadUrl({ fileId });
  return result.url;
}
