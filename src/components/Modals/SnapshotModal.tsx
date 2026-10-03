import React, { useState } from 'react';
import { X, Camera, RotateCcw, Trash2, Clock, Check, Plus } from 'lucide-react';
import { PreviewSnapshot } from '../../types';

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: PreviewSnapshot[];
  onTakeSnapshot: (title?: string) => void;
  onRestoreSnapshot: (snapshot: PreviewSnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
  onClearAllSnapshots: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  onTakeSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
  onClearAllSnapshots,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [restoredId, setRestoredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onTakeSnapshot(newTitle.trim() || undefined);
    setNewTitle('');
  };

  const handleRestore = (snap: PreviewSnapshot) => {
    onRestoreSnapshot(snap);
    setRestoredId(snap.id);
    setTimeout(() => setRestoredId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Version Snapshots
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capture code states and restore them whenever needed
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
          {/* Quick Snapshot Action Form */}
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="Snapshot label (e.g. Before changing header styling)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Take Snapshot</span>
            </button>
          </form>

          {/* Snapshots List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Saved History ({snapshots.length})
              </span>
              {snapshots.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete all saved snapshots?')) {
                      onClearAllSnapshots();
                    }
                  }}
                  className="text-[11px] text-rose-500 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {snapshots.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-xs">
                No snapshots saved yet. Click "Take Snapshot" to capture current code state!
              </div>
            ) : (
              snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {snap.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(snap.timestamp).toLocaleTimeString()} · {new Date(snap.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      HTML: {snap.html.length}b · CSS: {snap.css.length}b · JS: {snap.js.length}b
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRestore(snap)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        restoredId === snap.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                      }`}
                    >
                      {restoredId === snap.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Restored</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteSnapshot(snap.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
