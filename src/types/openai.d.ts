// TypeScript definitions for window.openai ChatGPT Apps SDK
// Based on https://developers.openai.com/apps-sdk

export type DisplayMode = 'inline' | 'fullscreen' | 'pip';
export type Theme = 'light' | 'dark';

// Tool Input/Output types
export interface ToolInput {
  [key: string]: unknown;
}

export interface UserInfo {
  first_name?: string;
  last_name?: string;
  email?: string;
  user_id?: string;
}

export interface StructuredContent {
  intent?: 'consultation' | 'business_consultation' | 'personal_injury' | 'msa_draft' | 'finalization' | 'payment';
  status?: string;
  user_id?: string;
  message?: string;
  user?: UserInfo;
  requestId?: string;
  [key: string]: unknown;
}

export interface ToolOutput {
  intent?: 'consultation' | 'business_consultation' | 'personal_injury' | 'msa_draft' | 'finalization' | 'payment';
  content?: Array<{ type: string; text: string }>;
  structuredContent?: StructuredContent;
  data?: unknown;
  [key: string]: unknown;
}

// Response metadata from host
export interface ToolResponseMetadata {
  'openai/widgetSessionId'?: string;
  'openai/locale'?: string;
  'openai/userAgent'?: string;
  'openai/userLocation'?: {
    country?: string;
    region?: string;
    city?: string;
  };
  'openai/subject'?: string;
  'mcp/www_authenticate'?: string;
  [key: string]: unknown;
}

// Layout types
export interface SafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface WidgetState {
  [key: string]: unknown;
}

// Global state accessible from window.openai
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

// Method option types
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

export interface UploadFileResult {
  fileId: string;
}

export interface GetFileDownloadUrlOptions {
  fileId: string;
}

export interface GetFileDownloadUrlResult {
  url: string;
  expiresAt: string;
}

// Tool call result type
export interface ToolCallResult<T = unknown> {
  content?: Array<{ type: string; text: string }>;
  structuredContent?: T;
  _meta?: ToolResponseMetadata;
}

// Main API interface
export interface OpenAiApi extends OpenAiGlobals {
  // Tool calls
  callTool: <T = unknown>(name: string, args?: Record<string, unknown>) => Promise<ToolCallResult<T>>;

  // Communication
  sendFollowUpMessage: (options: SendFollowUpMessageOptions) => Promise<void>;

  // Display
  requestDisplayMode: (options: RequestDisplayModeOptions) => Promise<boolean>;
  requestClose: () => void;

  // State
  setWidgetState: (state: WidgetState) => void;

  // External
  openExternal: (options: OpenExternalOptions) => void;

  // File handling
  uploadFile: (file: File) => Promise<UploadFileResult>;
  getFileDownloadUrl: (options: GetFileDownloadUrlOptions) => Promise<GetFileDownloadUrlResult>;
}

declare global {
  interface Window {
    openai?: OpenAiApi;
  }
}

export {};
