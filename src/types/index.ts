export type TabType = 'html' | 'css' | 'js';

export type ViewMode = 'split' | 'editor' | 'preview' | 'source';

export type SplitOrientation = 'horizontal' | 'vertical';

export type DevicePreset = 'responsive' | 'mobile' | 'mobile-lg' | 'tablet' | 'laptop' | 'desktop';

export interface DeviceConfig {
  id: DevicePreset;
  label: string;
  width: number | null; // null for 100% responsive
  height: number | null;
  icon: string;
}

export interface ConsoleLogItem {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  content: string;
  timestamp: string;
  count?: number;
  line?: number;
  col?: number;
}

export interface PreviewError {
  message: string;
  source?: string;
  line?: number;
  col?: number;
  stack?: string;
  timestamp: string;
}

export interface CdnLibrary {
  id: string;
  name: string;
  description: string;
  type: 'css' | 'js';
  url: string;
  enabled: boolean;
  category: 'styling' | 'icons' | 'utility' | 'fonts' | 'custom';
}

export interface PreviewSnapshot {
  id: string;
  sessionId: string;
  title: string;
  html: string;
  css: string;
  js: string;
  timestamp: number;
}

export interface LivePreviewSession {
  id: string;
  title: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  viewportSize: {
    width: number | null;
    height: number | null;
  };
  lastRenderedAt: number;
  errorLog: PreviewError[];
}

export type ThemeSyncMode = 'sync' | 'light' | 'dark';
