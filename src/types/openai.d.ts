// TypeScript definitions for window.openai ChatGPT Apps SDK

export type DisplayMode = 'inline' | 'fullscreen' | 'pip';
export type Theme = 'light' | 'dark';

export interface ToolInput {
  [key: string]: unknown;
}

export interface StructuredContent {
  intent?: 'consultation' | 'msa_draft' | 'finalization' | 'payment';
  status?: string;
  user_id?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ToolOutput {
  intent?: 'consultation' | 'msa_draft' | 'finalization' | 'payment';
  content?: unknown[];
  structuredContent?: StructuredContent;
  data?: unknown;
  [key: string]: unknown;
}

export interface ToolResponseMetadata {
  [key: string]: unknown;
}

export interface SafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface WidgetState {
  [key: string]: unknown;
}

export interface OpenAiGlobals {
  // Environment
  theme: Theme;
  locale: string;
  userAgent: string;

  // Layout
  maxHeight: number;
  displayMode: DisplayMode;
  safeArea: SafeArea;

  // Data from tool calls
  toolInput: ToolInput;
  toolOutput: ToolOutput;
  toolResponseMetadata: ToolResponseMetadata;

  // Persisted state
  widgetState: WidgetState;
}

export interface CallToolOptions {
  name: string;
  args?: Record<string, unknown>;
}

export interface SendFollowUpMessageOptions {
  prompt: string;
}

export interface RequestDisplayModeOptions {
  mode: DisplayMode;
}

export interface OpenExternalOptions {
  href: string;
}

export interface OpenAiApi extends OpenAiGlobals {
  // Methods
  callTool: (name: string, args?: Record<string, unknown>) => Promise<unknown>;
  sendFollowUpMessage: (options: SendFollowUpMessageOptions) => Promise<void>;
  requestDisplayMode: (options: RequestDisplayModeOptions) => Promise<boolean>;
  setWidgetState: (state: WidgetState) => void;
  requestClose: () => void;
  openExternal: (options: OpenExternalOptions) => void;
}

declare global {
  interface Window {
    openai?: OpenAiApi;
  }
}

export {};
