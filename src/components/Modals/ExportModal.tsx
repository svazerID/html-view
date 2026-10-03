import React, { useState } from 'react';
import { X, Download, Copy, Check, Share2, FileCode, ExternalLink } from 'lucide-react';
import { CdnLibrary } from '../../types';
import { buildStandaloneHtml } from '../../utils/compiler';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
  libraries: CdnLibrary[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  html,
  css,
  js,
  libraries,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [exportTitle, setExportTitle] = useState('My Live Webpage');

  if (!isOpen) return null;

  const standaloneDoc = buildStandaloneHtml({
    html,
    css,
    js,
    libraries,
    title: exportTitle,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(standaloneDoc);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `${exportTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'index'}.html`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareLink = () => {
    try {
      const payload = {
        h: html,
        c: css,
        j: js,
      };
      const jsonStr = JSON.stringify(payload);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
      const shareUrl = `${window.location.origin}${window.location.pathname}#code=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    } catch (err) {
      console.error('Failed to encode share link', err);
    }
  };

  const fileSizeKb = (new Blob([standaloneDoc]).size / 1024).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Export & Share
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download a self-contained HTML file or copy shareable link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={exportTitle}
              onChange={(e) => setExportTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download File */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
                  <Download className="w-4 h-4" />
                  <span>Standalone HTML</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ready-to-host single `.html` file with all CSS & JS embedded.
                </p>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  Payload size: ~{fileSizeKb} KB
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full mt-3 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .html</span>
              </button>
            </div>

            {/* Copy Full Code */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
                  <FileCode className="w-4 h-4" />
                  <span>Copy Source Code</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Copies the compiled clean HTML code directly to clipboard.
                </p>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  {standaloneDoc.split('\n').length} total lines
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="w-full mt-3 py-2 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Document</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 rounded-xl">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Share2 className="w-3.5 h-3.5" />
                <span>Direct Shareable URL</span>
              </div>
              <button
                onClick={handleShareLink}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copiedShareLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <span>Copy Link</span>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Encodes the entire HTML, CSS, and JS contents inside the browser URL hash so you can share your work without any server storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
