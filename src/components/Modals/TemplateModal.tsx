import React from 'react';
import { X, Sparkles, Layout, Layers, Check } from 'lucide-react';
import { STARTER_TEMPLATES, TemplateItem } from '../../constants/templates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateItem) => void;
  currentTemplateId?: string;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplateId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Starter Templates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a pre-configured template with HTML5, CSS3, and JavaScript ready to edit
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

        {/* Templates Grid */}
        <div className="p-4 overflow-y-auto space-y-3">
          {STARTER_TEMPLATES.map((tmpl) => {
            const isCurrent = currentTemplateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className="border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 rounded-xl p-4 transition-all duration-200 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      {tmpl.category}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {tmpl.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                    {tmpl.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-mono pt-1">
                    <span>HTML: {tmpl.html.split('\n').length} lines</span>
                    <span>·</span>
                    <span>CSS: {tmpl.css.split('\n').length} lines</span>
                    <span>·</span>
                    <span>JS: {tmpl.js.split('\n').length} lines</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs group-hover:scale-102'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Loaded</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load Template</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
