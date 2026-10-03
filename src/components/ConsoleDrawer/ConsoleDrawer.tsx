import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Check,
  Search,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ConsoleLogItem } from '../../types';

interface ConsoleDrawerProps {
  logs: ConsoleLogItem[];
  onClearLogs: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ConsoleDrawer: React.FC<ConsoleDrawerProps> = ({
  logs,
  onClearLogs,
  isOpen,
  setIsOpen,
}) => {
  const [filter, setFilter] = useState<'all' | 'log' | 'info' | 'warn' | 'error'>('all');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new log if open
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const errorCount = logs.filter((l) => l.type === 'error').length;
  const warnCount = logs.filter((l) => l.type === 'warn').length;

  const filteredLogs = logs.filter((l) => {
    if (filter !== 'all' && l.type !== filter) return false;
    if (search.trim()) {
      return l.content.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.content}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950 flex flex-col shrink-0 transition-all font-mono select-none z-10">
      {/* Header bar / Toggle */}
      <div className="h-9 px-3 bg-slate-900 flex items-center justify-between text-xs text-slate-300">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 cursor-pointer hover:text-white"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold font-sans">Console</span>
          <span className="text-[11px] text-slate-500 font-mono">({logs.length})</span>

          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded-md font-sans">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              {errorCount}
            </span>
          )}

          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded-md font-sans">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              {warnCount}
            </span>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          {isOpen && (
            <>
              {/* Filter segmented buttons */}
              <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800 text-[11px] mr-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-0.5 rounded ${
                    filter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('log')}
                  className={`px-2 py-0.5 rounded ${
                    filter === 'log' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Logs
                </button>
                <button
                  onClick={() => setFilter('warn')}
                  className={`px-2 py-0.5 rounded ${
                    filter === 'warn' ? 'bg-slate-800 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Warn
                </button>
                <button
                  onClick={() => setFilter('error')}
                  className={`px-2 py-0.5 rounded ${
                    filter === 'error' ? 'bg-slate-800 text-rose-300 font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Errors
                </button>
              </div>

              {/* Search */}
              <div className="relative mr-2 hidden sm:block">
                <Search className="w-3 h-3 absolute left-2 top-1.5 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter console..."
                  className="bg-slate-950 border border-slate-800 rounded pl-6 pr-2 py-0.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-32"
                />
              </div>

              <button
                onClick={handleCopyLogs}
                title="Copy all logs"
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors text-slate-400"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClearLogs}
                title="Clear console"
                className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors text-slate-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors text-slate-400 ml-1"
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Log Messages Area */}
      {isOpen && (
        <div className="h-44 overflow-y-auto p-2 text-xs space-y-1 bg-slate-950 select-text">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
              Console output is empty
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isError = log.type === 'error';
              const isWarn = log.type === 'warn';
              const isInfo = log.type === 'info';

              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 px-2 py-1 rounded text-[12px] leading-5 border-l-2 ${
                    isError
                      ? 'bg-rose-950/20 text-rose-300 border-rose-500'
                      : isWarn
                      ? 'bg-amber-950/20 text-amber-300 border-amber-500'
                      : isInfo
                      ? 'bg-blue-950/20 text-blue-300 border-blue-500'
                      : 'bg-slate-900/40 text-slate-200 border-slate-700'
                  }`}
                >
                  <span className="text-slate-500 text-[10px] shrink-0 select-none">
                    {log.timestamp}
                  </span>
                  <span className="font-semibold text-[10px] uppercase shrink-0 opacity-80">
                    [{log.type}]
                  </span>
                  <pre className="whitespace-pre-wrap break-all flex-1 font-mono text-[11.5px]">
                    {log.content}
                  </pre>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
