import React, { useState } from 'react';
import {
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Maximize2,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  X,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import { DevicePreset, PreviewError } from '../../types';
import { DEVICE_PRESETS } from '../../constants/devices';
import { highlightCode } from '../../utils/formatter';

interface PreviewFrameProps {
  compiledDoc: string;
  device: DevicePreset;
  setDevice: (d: DevicePreset) => void;
  renderLatencyMs: number;
  lastRenderedAt: number;
  error: PreviewError | null;
  onClearError: () => void;
  isCompiling: boolean;
  onReload: () => void;
  isSourceMode?: boolean;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  compiledDoc,
  device,
  setDevice,
  renderLatencyMs,
  lastRenderedAt,
  error,
  onClearError,
  isCompiling,
  onReload,
  isSourceMode = false,
}) => {
  const [scale, setScale] = useState<number>(100);
  const [isLandscape, setIsLandscape] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  // Find active device config
  const currentConfig = DEVICE_PRESETS.find((d) => d.id === device) || DEVICE_PRESETS[0];

  // Calculate actual width & height based on device & orientation
  let frameWidth: number | string = '100%';
  let frameHeight: number | string = '100%';

  if (currentConfig.width !== null && currentConfig.height !== null) {
    if (isLandscape) {
      frameWidth = `${currentConfig.height}px`;
      frameHeight = `${currentConfig.width}px`;
    } else {
      frameWidth = `${currentConfig.width}px`;
      frameHeight = `${currentConfig.height}px`;
    }
  }

  const handleCopySource = () => {
    navigator.clipboard.writeText(compiledDoc);
    setCopiedSource(true);
    setTimeout(() => setCopiedSource(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-900/60 overflow-hidden relative">
      {/* Preview Top Toolbar */}
      <div className="h-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between shrink-0 select-none text-xs">
        {/* Device & Dimensions Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
            {device === 'responsive' && <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />}
            {device.startsWith('mobile') && <Smartphone className="w-3.5 h-3.5 text-indigo-500" />}
            {device === 'tablet' && <Tablet className="w-3.5 h-3.5 text-indigo-500" />}
            {device === 'laptop' && <Laptop className="w-3.5 h-3.5 text-indigo-500" />}
            {device === 'desktop' && <Monitor className="w-3.5 h-3.5 text-indigo-500" />}
            <span>{currentConfig.label}</span>
          </div>

          {currentConfig.width && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {frameWidth} × {frameHeight}
            </span>
          )}

          {currentConfig.width && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              title="Rotate orientation (Landscape / Portrait)"
              className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center: Live Render Badge */}
        <div className="hidden sm:flex items-center gap-2">
          {isCompiling ? (
            <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              Compiling...
            </span>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
              Render: {renderLatencyMs.toFixed(1)}ms · {new Date(lastRenderedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Right: Zoom Scale & Device Quick Switch */}
        <div className="flex items-center gap-1.5">
          {currentConfig.width && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded px-1 text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setScale((s) => Math.max(50, s - 10))}
                title="Zoom out"
                className="p-0.5 hover:text-indigo-500"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="px-1">{scale}%</span>
              <button
                onClick={() => setScale((s) => Math.min(120, s + 10))}
                title="Zoom in"
                className="p-0.5 hover:text-indigo-500"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          )}

          {isSourceMode && (
            <button
              onClick={handleCopySource}
              className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium transition-colors"
            >
              {copiedSource ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>Copy HTML</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Area: Either Live Iframe Sandbox OR Source Viewer */}
      <div className={`flex-1 overflow-auto ${currentConfig.width !== null ? 'p-2 sm:p-4' : 'p-0'} flex items-center justify-center relative`}>
        {/* Error Notification Overlay */}
        {error && (
          <div className="absolute top-4 left-4 right-4 z-30 max-w-2xl mx-auto bg-rose-950/90 text-rose-100 border border-rose-500/50 shadow-xl rounded-xl p-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-rose-200">Execution Error</span>
                    {error.line && (
                      <span className="font-mono text-[11px] bg-rose-900/80 px-1.5 py-0.2 rounded text-rose-300 border border-rose-700/50">
                        Line {error.line}:{error.col || 0}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-rose-100/90 font-mono mt-1 break-all">
                    {error.message}
                  </p>
                  {error.stack && (
                    <details className="mt-1 text-[11px] text-rose-300/80 cursor-pointer">
                      <summary className="hover:underline">Stack Trace</summary>
                      <pre className="mt-1 p-2 bg-black/40 rounded text-[10px] overflow-x-auto whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
              <button
                onClick={onClearError}
                className="text-rose-400 hover:text-white p-1 rounded-md hover:bg-rose-900/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {isSourceMode ? (
          /* View Source Mode */
          <div className="w-full h-full bg-slate-950 rounded-xl border border-slate-800 overflow-auto p-4 font-mono text-xs text-slate-200 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                Compiled Document Structure (DOM Output)
              </span>
              <span className="text-slate-500">{compiledDoc.length} bytes</span>
            </div>
            <pre className="whitespace-pre overflow-x-auto text-[12px] leading-5">
              <code
                dangerouslySetInnerHTML={{
                  __html: highlightCode(compiledDoc, 'html'),
                }}
              />
            </pre>
          </div>
        ) : (
          /* Live Sandbox Preview Frame */
          <div
            className={`transition-all duration-200 flex items-center justify-center ${
              currentConfig.width !== null
                ? 'bg-slate-900/90 p-3 rounded-2xl shadow-2xl border border-slate-700/60'
                : 'w-full h-full'
            }`}
            style={{
              transform: currentConfig.width ? `scale(${scale / 100})` : 'none',
              transformOrigin: 'top center',
            }}
          >
            <div
              className="relative overflow-hidden bg-white shadow-md transition-all"
              style={{
                width: frameWidth,
                height: currentConfig.height ? frameHeight : '100%',
                borderRadius: currentConfig.width ? (device.startsWith('mobile') ? '28px' : '12px') : '0',
                border: currentConfig.width ? '4px solid #1e293b' : 'none',
              }}
            >
              {/* Simulated Mobile Notch / Speaker Bezel */}
              {device.startsWith('mobile') && !isLandscape && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 pointer-events-none flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-3"></div>
                </div>
              )}

              {/* Sandboxed Iframe (strict security sandbox: allow-scripts allow-modals, isolated origin) */}
              <iframe
                id="live-preview-iframe"
                title="Live Sandboxed Preview"
                srcDoc={compiledDoc}
                sandbox="allow-scripts allow-modals"
                className="w-full h-full border-0 block bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
