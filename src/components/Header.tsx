import React from 'react';
import {
  Code,
  Eye,
  Columns,
  Rows,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Maximize2,
  RefreshCw,
  FolderOpen,
  Camera,
  Share2,
  Settings2,
  Sun,
  Moon,
  FileCode2,
  Sliders,
} from 'lucide-react';
import { ViewMode, SplitOrientation, DevicePreset } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  orientation: SplitOrientation;
  setOrientation: (o: SplitOrientation) => void;
  device: DevicePreset;
  setDevice: (d: DevicePreset) => void;
  autoReload: boolean;
  setAutoReload: (b: boolean) => void;
  debounceMs: number;
  setDebounceMs: (ms: number) => void;
  isCompiling: boolean;
  onManualReload: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onOpenTemplates: () => void;
  onOpenSnapshots: () => void;
  onOpenLibraries: () => void;
  onOpenExport: () => void;
  onOpenMobileTools?: () => void;
  snapshotCount: number;
  libraryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  orientation,
  setOrientation,
  device,
  setDevice,
  autoReload,
  setAutoReload,
  debounceMs,
  setDebounceMs,
  isCompiling,
  onManualReload,
  isDark,
  setIsDark,
  onOpenTemplates,
  onOpenSnapshots,
  onOpenLibraries,
  onOpenExport,
  onOpenMobileTools,
  snapshotCount,
  libraryCount,
}) => {
  return (
    <header className="h-13 sm:h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 select-none transition-colors z-20">
      {/* Brand & Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xs font-black text-xs sm:text-sm shrink-0">
            &lt;/&gt;
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-slate-100 truncate">
                HTML View <span className="text-indigo-600 dark:text-indigo-400">+ Live</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-md shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sandbox
              </span>
            </div>
          </div>
        </div>

        {/* Templates Picker Button (Desktop) */}
        <button
          onClick={onOpenTemplates}
          title="Choose starter template"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-md transition-colors shrink-0"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Templates</span>
        </button>
      </div>

      {/* Center Controls: View modes & Device selectors (Shown on tablet/desktop) */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Layout Segmented Control */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <button
            onClick={() => setViewMode('editor')}
            title="Editor only"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'editor'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            title="Split view"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'split'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            title="Live Preview only"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live</span>
          </button>

          <button
            onClick={() => setViewMode('source')}
            title="Inspect compiled HTML source"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'source'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Source</span>
          </button>
        </div>

        {/* Orientation toggle if split */}
        {viewMode === 'split' && (
          <button
            onClick={() => setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')}
            title={`Switch to ${orientation === 'horizontal' ? 'Vertical' : 'Horizontal'} split`}
            className="hidden lg:flex p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {orientation === 'horizontal' ? <Rows className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
          </button>
        )}

        {/* Device Viewport Selector (shown if preview or split is active on wide screens) */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="hidden xl:flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <button
              onClick={() => setDevice('responsive')}
              title="Responsive 100%"
              className={`p-1.5 rounded-md transition-all ${
                device === 'responsive'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              title="Mobile (375px)"
              className={`p-1.5 rounded-md transition-all ${
                device === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              title="Tablet (768px)"
              className={`p-1.5 rounded-md transition-all ${
                device === 'tablet'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('laptop')}
              title="Laptop (1024px)"
              className={`p-1.5 rounded-md transition-all ${
                device === 'laptop'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              title="Desktop (1280px)"
              className={`p-1.5 rounded-md transition-all ${
                device === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Quick Refresh */}
        <button
          onClick={onManualReload}
          title="Force reload preview"
          className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isCompiling ? 'animate-spin text-indigo-500' : ''}`} />
        </button>

        {/* Mobile Tools Sheet Trigger (on phones) */}
        <button
          onClick={onOpenMobileTools}
          title="Open tools & controls"
          className="sm:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
        >
          <Sliders className="w-4 h-4" />
          {snapshotCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full" />
          )}
        </button>

        {/* Live Reload Toggle (Desktop) */}
        <div className="hidden md:flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-md text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
            <input
              type="checkbox"
              checked={autoReload}
              onChange={(e) => setAutoReload(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700"
            />
            <span>Live Reload</span>
          </label>
          <span className="text-slate-400 dark:text-slate-500 text-[10px]">({debounceMs}ms)</span>
        </div>

        {/* Snapshots Button (Desktop) */}
        <button
          onClick={onOpenSnapshots}
          title="Manage version snapshots"
          className="hidden sm:flex relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
        >
          <Camera className="w-4 h-4" />
          {snapshotCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {snapshotCount}
            </span>
          )}
        </button>

        {/* CSS Libraries Button (Desktop) */}
        <button
          onClick={onOpenLibraries}
          title="Inject CSS frameworks & CDN libraries"
          className="hidden sm:flex relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          {libraryCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {libraryCount}
            </span>
          )}
        </button>

        {/* Export / Share Button (Desktop) */}
        <button
          onClick={onOpenExport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Dark / Light Toggle (Desktop) */}
        <button
          onClick={() => setIsDark(!isDark)}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="hidden sm:flex p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors ml-1"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
