import React, { useState } from 'react';
import { X, Plus, Trash2, Globe, ShieldCheck, Check } from 'lucide-react';
import { CdnLibrary } from '../../types';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  libraries: CdnLibrary[];
  setLibraries: React.Dispatch<React.SetStateAction<CdnLibrary[]>>;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  libraries,
  setLibraries,
}) => {
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<'css' | 'js'>('css');

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setLibraries((prev) =>
      prev.map((lib) => (lib.id === id ? { ...lib, enabled: !lib.enabled } : lib))
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newLib: CdnLibrary = {
      id: 'custom-' + Date.now(),
      name: customName.trim() || (customType === 'css' ? 'Custom Stylesheet' : 'Custom Script'),
      description: 'User-injected CDN resource',
      type: customType,
      url: customUrl.trim(),
      enabled: true,
      category: 'custom',
    };

    setLibraries((prev) => [...prev, newLib]);
    setCustomName('');
    setCustomUrl('');
  };

  const handleRemove = (id: string) => {
    setLibraries((prev) => prev.filter((lib) => lib.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Custom CSS & External Libraries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inject popular CSS frameworks, web fonts, and JavaScript libraries into the sandbox
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
          {/* Preset Libraries */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Standard CDN Presets
            </h4>
            <div className="space-y-2">
              {libraries.map((lib) => (
                <div
                  key={lib.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    lib.enabled
                      ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          lib.type === 'css'
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {lib.type}
                      </span>
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {lib.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lib.description || lib.url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {lib.category === 'custom' && (
                      <button
                        onClick={() => handleRemove(lib.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        title="Delete custom library"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleToggle(lib.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                        lib.enabled
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                      }`}
                    >
                      {lib.enabled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <span>Disabled</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Injection */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Inject Custom CSS / JS URL
            </h4>
            <form onSubmit={handleAddCustom} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Library Label (e.g. Bulma CSS, Lodash)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as 'css' | 'js')}
                  className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-semibold focus:outline-none"
                >
                  <option value="css">CSS (.css)</option>
                  <option value="js">JS (.js)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://cdn.example.com/library.min.css"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  required
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
