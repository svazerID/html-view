import React, { useState, useRef } from 'react';
import {
  FileCode,
  Palette,
  FileJson,
  Copy,
  Check,
  Sparkles,
  Trash2,
  WrapText,
  AlertCircle,
} from 'lucide-react';
import { TabType, PreviewError } from '../../types';
import { simpleFormatCode } from '../../utils/formatter';
import { MobileQuickBar } from '../MobileQuickBar';

interface CodeEditorProps {
  html: string;
  setHtml: (val: string) => void;
  css: string;
  setCss: (val: string) => void;
  js: string;
  setJs: (val: string) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  error?: PreviewError | null;
  onRunNow?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  html,
  setHtml,
  css,
  setCss,
  js,
  setJs,
  activeTab,
  setActiveTab,
  error,
  onRunNow,
}) => {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true); // Default wrap true for mobile comfort
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const currentContent = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const setContent = (val: string) => {
    if (activeTab === 'html') setHtml(val);
    else if (activeTab === 'css') setCss(val);
    else setJs(val);
  };

  const lines = currentContent.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll of line numbers gutter with textarea
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor line and col
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const { selectionStart } = textareaRef.current;
    const textBefore = currentContent.substring(0, selectionStart);
    const lineArray = textBefore.split('\n');
    setCursorPos({
      line: lineArray.length,
      col: lineArray[lineArray.length - 1].length + 1,
    });
  };

  // Mobile quick insertion helper
  const handleInsertSnippet = (snippet: string, cursorOffset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      currentContent.substring(0, start) + snippet + currentContent.substring(end);
    setContent(newContent);

    const newPos = cursorOffset !== undefined ? start + cursorOffset : start + snippet.length;

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
      updateCursorPosition();
    }, 0);
  };

  const handleMobileIndent = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      currentContent.substring(0, start) + '  ' + currentContent.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
      updateCursorPosition();
    }, 0);
  };

  const handleMobileOutdent = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const before = currentContent.substring(0, start);
    const lastNewLine = before.lastIndexOf('\n');
    const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
    if (currentContent.substring(lineStart, lineStart + 2) === '  ') {
      const newContent =
        currentContent.substring(0, lineStart) + currentContent.substring(lineStart + 2);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(Math.max(lineStart, start - 2), Math.max(lineStart, start - 2));
        updateCursorPosition();
      }, 0);
    }
  };

  // Advanced keyboard indentation & bracket pairing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Ctrl/Cmd + S = Run/Compile
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onRunNow?.();
      return;
    }

    // Tab key = 2 spaces indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Outdent
        const before = currentContent.substring(0, start);
        const lastNewLine = before.lastIndexOf('\n');
        const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
        if (currentContent.substring(lineStart, lineStart + 2) === '  ') {
          const newContent =
            currentContent.substring(0, lineStart) + currentContent.substring(lineStart + 2);
          setContent(newContent);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, start - 2);
            textarea.selectionEnd = Math.max(lineStart, end - 2);
          }, 0);
        }
      } else {
        // Indent 2 spaces
        const newContent =
          currentContent.substring(0, start) + '  ' + currentContent.substring(end);
        setContent(newContent);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateCursorPosition();
        }, 0);
      }
      return;
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const before = currentContent.substring(0, start);
      const lastLine = before.split('\n').pop() || '';
      const match = lastLine.match(/^(\s+)/);
      if (match) {
        e.preventDefault();
        const indent = match[1];
        const extraIndent = lastLine.trim().endsWith('{') ? '  ' : '';
        const insertion = '\n' + indent + extraIndent;
        const newContent =
          currentContent.substring(0, start) + insertion + currentContent.substring(start);
        setContent(newContent);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
          updateCursorPosition();
        }, 0);
        return;
      }
    }

    // Auto pair brackets: { [ ( " ' `
    const pairs: Record<string, string> = {
      '{': '}',
      '[': ']',
      '(': ')',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    if (pairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // If text selected, wrap it
      if (start !== end) {
        e.preventDefault();
        const selected = currentContent.substring(start, end);
        const wrapped = e.key + selected + pairs[e.key];
        const newContent =
          currentContent.substring(0, start) + wrapped + currentContent.substring(end);
        setContent(newContent);
        setTimeout(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        }, 0);
        return;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    const formatted = simpleFormatCode(currentContent, activeTab);
    setContent(formatted);
  };

  const handleClear = () => {
    if (window.confirm(`Clear all ${activeTab.toUpperCase()} content?`)) {
      setContent('');
    }
  };

  // Check if error is relevant to this active tab
  const hasErrorOnTab =
    error &&
    ((activeTab === 'js' && (error.source?.includes('user-script') || !error.source)) ||
      (activeTab === 'html' && error.source?.includes('html')));

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans border-r border-slate-800">
      {/* Tab bar header */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-1">
          {/* HTML Tab */}
          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-t-md transition-all ${
              activeTab === 'html'
                ? 'bg-slate-950 text-orange-400 border-t-2 border-orange-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-orange-500" />
            <span>HTML</span>
            <span className="text-[10px] opacity-60 font-mono hidden xs:inline">
              ({html.split('\n').length})
            </span>
          </button>

          {/* CSS Tab */}
          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-t-md transition-all ${
              activeTab === 'css'
                ? 'bg-slate-950 text-sky-400 border-t-2 border-sky-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-sky-400" />
            <span>CSS</span>
            <span className="text-[10px] opacity-60 font-mono hidden xs:inline">
              ({css.split('\n').length})
            </span>
          </button>

          {/* JS Tab */}
          <button
            onClick={() => setActiveTab('js')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-t-md transition-all relative ${
              activeTab === 'js'
                ? 'bg-slate-950 text-amber-300 border-t-2 border-amber-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span>JS</span>
            <span className="text-[10px] opacity-60 font-mono hidden xs:inline">
              ({js.split('\n').length})
            </span>
            {error && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5" title="Error detected" />
            )}
          </button>
        </div>

        {/* Editor Actions Toolbar */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-slate-400">
          <button
            onClick={handleFormat}
            title="Format / Beautify code"
            className="p-1.5 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setWordWrap(!wordWrap)}
            title={`Word wrap: ${wordWrap ? 'ON' : 'OFF'}`}
            className={`p-1.5 rounded transition-colors ${
              wordWrap ? 'text-indigo-400 bg-slate-800' : 'hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy current tab code"
            className="p-1.5 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleClear}
            title="Clear tab content"
            className="p-1.5 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Main Canvas: Gutter + Monospace Textarea */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-sm leading-6">
        {/* Line Numbers Gutter (compact on small screens) */}
        <div
          ref={gutterRef}
          className="w-9 sm:w-12 bg-slate-950 text-slate-600 select-none py-3 text-right pr-2 sm:pr-3 border-r border-slate-800/80 overflow-hidden shrink-0 text-[10px] sm:text-xs"
        >
          {Array.from({ length: lineCount }).map((_, index) => {
            const lineNum = index + 1;
            const isErrorLine = hasErrorOnTab && error?.line === lineNum;
            const isCurrentLine = cursorPos.line === lineNum;

            return (
              <div
                key={index}
                className={`relative h-6 flex items-center justify-end ${
                  isErrorLine
                    ? 'text-rose-400 font-bold bg-rose-500/20 rounded-xs'
                    : isCurrentLine
                    ? 'text-slate-300 font-semibold'
                    : ''
                }`}
              >
                {isErrorLine && (
                  <span className="absolute left-0.5 text-rose-500 text-[10px]" title="Error here">
                    ●
                  </span>
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea Input */}
        <div className="relative flex-1 h-full overflow-hidden bg-slate-950">
          <textarea
            ref={textareaRef}
            value={currentContent}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className={`w-full h-full p-2.5 sm:p-3 bg-transparent text-slate-100 font-mono text-[13px] leading-6 resize-none outline-none border-none tab-size-2 selection:bg-indigo-600/40 ${
              wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'
            }`}
            placeholder={`Enter ${activeTab.toUpperCase()} code here...`}
          />
        </div>
      </div>

      {/* Mobile Coding Quick Accessory Bar (shown on phone/tablet) */}
      <MobileQuickBar
        onInsert={handleInsertSnippet}
        onIndent={handleMobileIndent}
        onOutdent={handleMobileOutdent}
        activeTab={activeTab}
      />

      {/* Status Bar */}
      <div className="h-6 bg-slate-900 border-t border-slate-800/80 px-2 sm:px-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 shrink-0 font-mono">
        <div className="flex items-center gap-2 sm:gap-3">
          <span>{activeTab.toUpperCase()}</span>
          <span>·</span>
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{lines.length} lines</span>
        </div>

        <div className="flex items-center gap-2">
          {hasErrorOnTab && (
            <span className="flex items-center gap-1 text-rose-400 font-sans">
              <AlertCircle className="w-3 h-3" />
              <span>Line {error?.line || '?'}</span>
            </span>
          )}
          <span className="text-slate-500">2 spaces</span>
        </div>
      </div>
    </div>
  );
};
