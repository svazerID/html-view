import React from 'react';
import { Code, Eye, Columns, Terminal, Sliders, AlertCircle } from 'lucide-react';
import { ViewMode } from '../types';

interface MobileNavBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isConsoleOpen: boolean;
  setIsConsoleOpen: (open: boolean) => void;
  onOpenMobileTools: () => void;
  errorCount: number;
  hasErrors: boolean;
  totalLogs: number;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  viewMode,
  setViewMode,
  isConsoleOpen,
  setIsConsoleOpen,
  onOpenMobileTools,
  errorCount,
  hasErrors,
  totalLogs,
}) => {
  return (
    <nav className="sm:hidden h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 shrink-0 select-none z-30">
      {/* Code Editor Tab */}
      <button
        onClick={() => {
          setViewMode('editor');
          if (isConsoleOpen) setIsConsoleOpen(false);
        }}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative ${
          viewMode === 'editor' && !isConsoleOpen
            ? 'text-indigo-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Code className="w-4 h-4" />
          {hasErrors && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </div>
        <span className="text-[10px]">Code</span>
      </button>

      {/* Split Tab */}
      <button
        onClick={() => {
          setViewMode('split');
          if (isConsoleOpen) setIsConsoleOpen(false);
        }}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
          viewMode === 'split' && !isConsoleOpen
            ? 'text-indigo-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Columns className="w-4 h-4" />
        <span className="text-[10px]">Split</span>
      </button>

      {/* Live Preview Tab */}
      <button
        onClick={() => {
          setViewMode('preview');
          if (isConsoleOpen) setIsConsoleOpen(false);
        }}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative ${
          viewMode === 'preview' && !isConsoleOpen
            ? 'text-indigo-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Eye className="w-4 h-4" />
          <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <span className="text-[10px]">Live</span>
      </button>

      {/* Console Tab */}
      <button
        onClick={() => setIsConsoleOpen(!isConsoleOpen)}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative ${
          isConsoleOpen ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Terminal className="w-4 h-4" />
          {errorCount > 0 ? (
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white rounded-full text-[8px] font-bold px-1 min-w-[12px] h-3 flex items-center justify-center">
              {errorCount}
            </span>
          ) : totalLogs > 0 ? (
            <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-sky-500" />
          ) : null}
        </div>
        <span className="text-[10px]">Console</span>
      </button>

      {/* Tools Menu Tab */}
      <button
        onClick={onOpenMobileTools}
        className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Sliders className="w-4 h-4 text-slate-300" />
        <span className="text-[10px]">Tools</span>
      </button>
    </nav>
  );
};
