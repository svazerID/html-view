/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/Editor/CodeEditor';
import { PreviewFrame } from './components/Preview/PreviewFrame';
import { ConsoleDrawer } from './components/ConsoleDrawer/ConsoleDrawer';
import { MobileNavBar } from './components/MobileNavBar';
import { MobileToolsSheet } from './components/MobileToolsSheet';
import { TemplateModal } from './components/Modals/TemplateModal';
import { LibraryModal } from './components/Modals/LibraryModal';
import { SnapshotModal } from './components/Modals/SnapshotModal';
import { ExportModal } from './components/Modals/ExportModal';

import {
  TabType,
  ViewMode,
  SplitOrientation,
  DevicePreset,
  ConsoleLogItem,
  PreviewError,
  CdnLibrary,
  PreviewSnapshot,
} from './types';
import { STARTER_TEMPLATES, TemplateItem } from './constants/templates';
import { DEFAULT_LIBRARIES } from './constants/libraries';
import { compilePreviewDocument } from './utils/compiler';

export default function App() {
  // Initial default template
  const initialTemplate = STARTER_TEMPLATES[0];

  // Detect mobile width initially
  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 640;

  // Editor content states
  const [html, setHtml] = useState<string>(initialTemplate.html);
  const [css, setCss] = useState<string>(initialTemplate.css);
  const [js, setJs] = useState<string>(initialTemplate.js);
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(initialTemplate.id);

  // View & Layout states
  const [viewMode, setViewMode] = useState<ViewMode>(isMobileScreen ? 'editor' : 'split');
  const [orientation, setOrientation] = useState<SplitOrientation>(
    isMobileScreen ? 'vertical' : 'horizontal'
  );
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage for editor
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [device, setDevice] = useState<DevicePreset>('responsive');

  // Reload & Compiler states
  const [autoReload, setAutoReload] = useState<boolean>(true);
  const [debounceMs, setDebounceMs] = useState<number>(300);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compiledDoc, setCompiledDoc] = useState<string>('');
  const [renderLatencyMs, setRenderLatencyMs] = useState<number>(0);
  const [lastRenderedAt, setLastRenderedAt] = useState<number>(Date.now());
  const [activeError, setActiveError] = useState<PreviewError | null>(null);

  // Console Drawer & Logs
  const [logs, setLogs] = useState<ConsoleLogItem[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);

  // Mobile tools drawer
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  // External CDN Libraries
  const [libraries, setLibraries] = useState<CdnLibrary[]>(() => {
    try {
      const saved = localStorage.getItem('html_live_libraries');
      return saved ? JSON.parse(saved) : DEFAULT_LIBRARIES;
    } catch {
      return DEFAULT_LIBRARIES;
    }
  });

  // Version Snapshots
  const [snapshots, setSnapshots] = useState<PreviewSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem('html_live_snapshots');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dark / Light Theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Adjust orientation on screen resize if needed
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && orientation === 'horizontal') {
        setOrientation('vertical');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [orientation]);

  // Persist libraries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('html_live_libraries', JSON.stringify(libraries));
    } catch (e) {}
  }, [libraries]);

  // Persist snapshots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('html_live_snapshots', JSON.stringify(snapshots));
    } catch (e) {}
  }, [snapshots]);

  // Check URL hash for shared code on mount
  useEffect(() => {
    if (window.location.hash.includes('#code=')) {
      try {
        const encoded = window.location.hash.replace('#code=', '');
        const decoded = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
        const parsed = JSON.parse(decoded);
        if (parsed.h !== undefined) setHtml(parsed.h);
        if (parsed.c !== undefined) setCss(parsed.c);
        if (parsed.j !== undefined) setJs(parsed.j);
        setCurrentTemplateId('');
      } catch (err) {
        console.error('Failed to parse code from hash', err);
      }
    }
  }, []);

  // Listen to sandbox postMessage events (Console logs & runtime errors)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'LIVE_PREVIEW_CONSOLE') {
        const newLog: ConsoleLogItem = {
          id: 'log-' + Date.now() + '-' + Math.random(),
          type: data.logType || 'log',
          content: data.content || '',
          timestamp: data.timestamp || new Date().toLocaleTimeString(),
        };

        setLogs((prev) => {
          // If error log, open console drawer on desktop
          if (newLog.type === 'error' && prev.length < 50 && window.innerWidth >= 640) {
            setIsConsoleOpen(true);
          }
          return [...prev.slice(-150), newLog];
        });
      } else if (data.type === 'LIVE_PREVIEW_ERROR') {
        const err: PreviewError = {
          message: data.message || 'Unknown runtime error',
          source: data.source,
          line: data.line,
          col: data.col,
          stack: data.stack,
          timestamp: data.timestamp || new Date().toLocaleTimeString(),
        };
        setActiveError(err);
      } else if (data.type === 'LIVE_PREVIEW_READY') {
        setIsCompiling(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Core Compilation Function
  const compileCode = useCallback(() => {
    setIsCompiling(true);
    const start = performance.now();

    try {
      const compiled = compilePreviewDocument({
        html,
        css,
        js,
        libraries,
        themeMode: 'sync',
        isParentDark: isDark,
      });

      setCompiledDoc(compiled);
      const elapsed = performance.now() - start;
      setRenderLatencyMs(elapsed);
      setLastRenderedAt(Date.now());
      setActiveError(null);
    } catch (err: any) {
      setActiveError({
        message: err.message || 'Compilation failed',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setTimeout(() => setIsCompiling(false), 50);
    }
  }, [html, css, js, libraries, isDark]);

  // Debounced auto-compilation pipeline (P0 requirement: debounce 300ms)
  useEffect(() => {
    if (!autoReload) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      compileCode();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [html, css, js, libraries, isDark, autoReload, debounceMs, compileCode]);

  // Initial compile on mount
  useEffect(() => {
    compileCode();
  }, []);

  // Split view dragging & touch handler
  const handleStartSplit = () => {
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDraggingSplit || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (orientation === 'horizontal') {
        const offset = clientX - rect.left;
        const newPct = Math.min(80, Math.max(20, (offset / rect.width) * 100));
        setSplitRatio(newPct);
      } else {
        const offset = clientY - rect.top;
        const newPct = Math.min(80, Math.max(20, (offset / rect.height) * 100));
        setSplitRatio(newPct);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDraggingSplit(false);
    };

    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingSplit, orientation]);

  // Snapshot handlers
  const handleTakeSnapshot = (customTitle?: string) => {
    const newSnapshot: PreviewSnapshot = {
      id: 'snap-' + Date.now(),
      sessionId: 'sess-1',
      title: customTitle || `Snapshot ${snapshots.length + 1}`,
      html,
      css,
      js,
      timestamp: Date.now(),
    };
    setSnapshots((prev) => [newSnapshot, ...prev]);
  };

  const handleRestoreSnapshot = (snap: PreviewSnapshot) => {
    setHtml(snap.html);
    setCss(snap.css);
    setJs(snap.js);
    setCurrentTemplateId('');
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAllSnapshots = () => {
    setSnapshots([]);
  };

  // Load a starter template
  const handleSelectTemplate = (tmpl: TemplateItem) => {
    setHtml(tmpl.html);
    setCss(tmpl.css);
    setJs(tmpl.js);
    setCurrentTemplateId(tmpl.id);
    setLogs([]);
    setActiveError(null);
  };

  const errorCount = logs.filter((l) => l.type === 'error').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Application Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        orientation={orientation}
        setOrientation={setOrientation}
        device={device}
        setDevice={setDevice}
        autoReload={autoReload}
        setAutoReload={setAutoReload}
        debounceMs={debounceMs}
        setDebounceMs={setDebounceMs}
        isCompiling={isCompiling}
        onManualReload={compileCode}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenSnapshots={() => setIsSnapshotModalOpen(true)}
        onOpenLibraries={() => setIsLibraryModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenMobileTools={() => setIsMobileToolsOpen(true)}
        snapshotCount={snapshots.length}
        libraryCount={libraries.filter((l) => l.enabled).length}
      />

      {/* Main Workspace Area */}
      <div
        ref={containerRef}
        className={`flex-1 flex overflow-hidden ${
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        }`}
      >
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div
            style={{
              width:
                viewMode === 'editor'
                  ? '100%'
                  : orientation === 'horizontal'
                  ? `${splitRatio}%`
                  : '100%',
              height:
                viewMode === 'editor'
                  ? '100%'
                  : orientation === 'vertical'
                  ? `${splitRatio}%`
                  : '100%',
            }}
            className="flex flex-col overflow-hidden shrink-0"
          >
            <CodeEditor
              html={html}
              setHtml={setHtml}
              css={css}
              setCss={setCss}
              js={js}
              setJs={setJs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              error={activeError}
              onRunNow={compileCode}
            />
          </div>
        )}

        {/* Resizable Divider in Split View */}
        {viewMode === 'split' && (
          <div
            onMouseDown={handleStartSplit}
            onTouchStart={handleStartSplit}
            onDoubleClick={() => setSplitRatio(50)}
            title="Drag to resize pane, double tap to reset 50/50"
            className={`transition-colors z-10 shrink-0 touch-none ${
              orientation === 'horizontal'
                ? 'w-2 hover:w-2 bg-slate-900 hover:bg-indigo-600 cursor-col-resize flex items-center justify-center'
                : 'h-2 hover:h-2 bg-slate-900 hover:bg-indigo-600 cursor-row-resize flex items-center justify-center'
            } ${isDraggingSplit ? 'bg-indigo-600' : ''}`}
          >
            <div
              className={`rounded-full bg-slate-600 ${
                orientation === 'horizontal' ? 'w-0.5 h-6' : 'h-0.5 w-6'
              }`}
            />
          </div>
        )}

        {/* Preview or Source Pane */}
        {(viewMode === 'split' || viewMode === 'preview' || viewMode === 'source') && (
          <div
            style={{
              width:
                viewMode === 'preview' || viewMode === 'source'
                  ? '100%'
                  : orientation === 'horizontal'
                  ? `${100 - splitRatio}%`
                  : '100%',
              height:
                viewMode === 'preview' || viewMode === 'source'
                  ? '100%'
                  : orientation === 'vertical'
                  ? `${100 - splitRatio}%`
                  : '100%',
            }}
            className="flex-1 flex flex-col overflow-hidden relative"
          >
            <PreviewFrame
              compiledDoc={compiledDoc}
              device={device}
              setDevice={setDevice}
              renderLatencyMs={renderLatencyMs}
              lastRenderedAt={lastRenderedAt}
              error={activeError}
              onClearError={() => setActiveError(null)}
              isCompiling={isCompiling}
              onReload={compileCode}
              isSourceMode={viewMode === 'source'}
            />
          </div>
        )}
      </div>

      {/* Bottom Console Drawer (Collapsible) */}
      <ConsoleDrawer
        logs={logs}
        onClearLogs={() => setLogs([])}
        isOpen={isConsoleOpen}
        setIsOpen={setIsConsoleOpen}
      />

      {/* Mobile Bottom Navigation Bar (Phone/Tablet viewports) */}
      <MobileNavBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isConsoleOpen={isConsoleOpen}
        setIsConsoleOpen={setIsConsoleOpen}
        onOpenMobileTools={() => setIsMobileToolsOpen(true)}
        errorCount={errorCount}
        hasErrors={activeError !== null}
        totalLogs={logs.length}
      />

      {/* Mobile Tools Action Sheet */}
      <MobileToolsSheet
        isOpen={isMobileToolsOpen}
        onClose={() => setIsMobileToolsOpen(false)}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenSnapshots={() => setIsSnapshotModalOpen(true)}
        onOpenLibraries={() => setIsLibraryModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onViewSource={() => setViewMode('source')}
        snapshotCount={snapshots.length}
        libraryCount={libraries.filter((l) => l.enabled).length}
        autoReload={autoReload}
        setAutoReload={setAutoReload}
        debounceMs={debounceMs}
        setDebounceMs={setDebounceMs}
        isDark={isDark}
        setIsDark={setIsDark}
        orientation={orientation}
        setOrientation={setOrientation}
        onManualReload={compileCode}
        isCompiling={isCompiling}
      />

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentTemplateId={currentTemplateId}
      />

      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        libraries={libraries}
        setLibraries={setLibraries}
      />

      <SnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        snapshots={snapshots}
        onTakeSnapshot={handleTakeSnapshot}
        onRestoreSnapshot={handleRestoreSnapshot}
        onDeleteSnapshot={handleDeleteSnapshot}
        onClearAllSnapshots={handleClearAllSnapshots}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        html={html}
        css={css}
        js={js}
        libraries={libraries}
      />
    </div>
  );
}
