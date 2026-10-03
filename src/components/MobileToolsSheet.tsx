import React from 'react';
import {
  X,
  FolderOpen,
  Camera,
  Settings2,
  Share2,
  RefreshCw,
  Sun,
  Moon,
  FileCode2,
  Sliders,
  Columns,
  Rows,
} from 'lucide-react';
import { SplitOrientation } from '../types';

interface MobileToolsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTemplates: () => void;
  onOpenSnapshots: () => void;
  onOpenLibraries: () => void;
  onOpenExport: () => void;
  onViewSource: () => void;
  snapshotCount: number;
  libraryCount: number;
  autoReload: boolean;
  setAutoReload: (b: boolean) => void;
  debounceMs: number;
  setDebounceMs: (ms: number) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  orientation: SplitOrientation;
  setOrientation: (o: SplitOrientation) => void;
  onManualReload: () => void;
  isCompiling: boolean;
}

export const MobileToolsSheet: React.FC<MobileToolsSheetProps> = ({
  isOpen,
  onClose,
  onOpenTemplates,
  onOpenSnapshots,
  onOpenLibraries,
  onOpenExport,
  onViewSource,
  snapshotCount,
  libraryCount,
  autoReload,
  setAutoReload,
  debounceMs,
  setDebounceMs,
  isDark,
  setIsDark,
  orientation,
  setOrientation,
  onManualReload,
  isCompiling,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full bg-slate-900 border-t border-slate-800 rounded-t-2xl shadow-2xl p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-slate-100">Sandbox Controls & Tools</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Templates */}
          <button
            onClick={() => {
              onClose();
              onOpenTemplates();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-200 block">Templates</span>
              <span className="text-[10px] text-slate-400">Pre-built demos</span>
            </div>
          </button>

          {/* Snapshots */}
          <button
            onClick={() => {
              onClose();
              onOpenSnapshots();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors relative"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-slate-200 block">Snapshots</span>
                {snapshotCount > 0 && (
                  <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                    {snapshotCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Version history</span>
            </div>
          </button>

          {/* External CSS / Libraries */}
          <button
            onClick={() => {
              onClose();
              onOpenLibraries();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors relative"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-slate-200 block">Libraries</span>
                {libraryCount > 0 && (
                  <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                    {libraryCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Tailwind, Fonts</span>
            </div>
          </button>

          {/* Export / Share */}
          <button
            onClick={() => {
              onClose();
              onOpenExport();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-left transition-colors shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-xs block">Export</span>
              <span className="text-[10px] text-indigo-100">HTML & Share</span>
            </div>
          </button>
        </div>

        {/* Settings & Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
          {/* Live Reload & Debounce */}
          <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
            <div>
              <span className="font-medium text-slate-200 block">Live Reload on Edit</span>
              <span className="text-[11px] text-slate-400">Auto-render when typing</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={debounceMs}
                onChange={(e) => setDebounceMs(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 outline-none"
              >
                <option value={200}>200ms</option>
                <option value={300}>300ms</option>
                <option value={500}>500ms</option>
                <option value={800}>800ms</option>
              </select>
              <input
                type="checkbox"
                checked={autoReload}
                onChange={(e) => setAutoReload(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-700"
              />
            </div>
          </div>

          {/* Theme & Split Orientation Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-left"
            >
              <span className="font-medium text-slate-200">Theme</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDark ? 'Dark' : 'Light'}</span>
              </div>
            </button>

            {/* Split Orientation */}
            <button
              onClick={() => setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')}
              className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-left"
            >
              <span className="font-medium text-slate-200">Split Style</span>
              <div className="flex items-center gap-1 text-indigo-400 font-semibold text-[11px]">
                {orientation === 'horizontal' ? <Columns className="w-3.5 h-3.5" /> : <Rows className="w-3.5 h-3.5" />}
                <span>{orientation === 'horizontal' ? 'Side-by-side' : 'Stacked'}</span>
              </div>
            </button>
          </div>

          {/* View Source & Force Reload Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onViewSource();
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 font-medium transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
              <span>View Source</span>
            </button>

            <button
              onClick={() => {
                onManualReload();
                onClose();
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isCompiling ? 'animate-spin' : ''}`} />
              <span>Force Reload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
