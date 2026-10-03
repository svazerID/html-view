import React from 'react';

interface MobileQuickBarProps {
  onInsert: (snippet: string, cursorOffset?: number) => void;
  onIndent: () => void;
  onOutdent: () => void;
  activeTab: 'html' | 'css' | 'js';
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onInsert,
  onIndent,
  onOutdent,
  activeTab,
}) => {
  // Tailored quick keys based on active tab
  const htmlKeys = [
    { label: '< >', insert: '<>', offset: 1 },
    { label: '</ >', insert: '</>', offset: 2 },
    { label: 'div', insert: '<div></div>', offset: 5 },
    { label: 'class=""', insert: 'class=""', offset: 7 },
    { label: 'id=""', insert: 'id=""', offset: 4 },
    { label: '"', insert: '""', offset: 1 },
    { label: '=', insert: '=' },
    { label: '/', insert: '/' },
  ];

  const cssKeys = [
    { label: '{ }', insert: '{\n  \n}', offset: 4 },
    { label: ':', insert: ': ' },
    { label: ';', insert: ';' },
    { label: '#', insert: '#' },
    { label: '.', insert: '.' },
    { label: '%', insert: '%' },
    { label: 'px', insert: 'px' },
    { label: 'rem', insert: 'rem' },
  ];

  const jsKeys = [
    { label: '( )', insert: '()', offset: 1 },
    { label: '{ }', insert: '{\n  \n}', offset: 4 },
    { label: '[ ]', insert: '[]', offset: 1 },
    { label: '=>', insert: ' => ' },
    { label: '=', insert: ' = ' },
    { label: ';', insert: ';' },
    { label: "'", insert: "''", offset: 1 },
    { label: '`', insert: '``', offset: 1 },
    { label: 'const', insert: 'const ' },
    { label: 'let', insert: 'let ' },
  ];

  const commonKeys = activeTab === 'html' ? htmlKeys : activeTab === 'css' ? cssKeys : jsKeys;

  return (
    <div className="flex md:hidden items-center gap-1.5 px-2 py-1.5 bg-slate-900 border-t border-slate-800 overflow-x-auto no-scrollbar shrink-0 select-none touch-pan-x">
      <button
        type="button"
        onClick={onOutdent}
        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 text-slate-300 text-xs font-mono font-semibold rounded shrink-0 shadow-xs"
        title="Outdent"
      >
        ⇤
      </button>

      <button
        type="button"
        onClick={onIndent}
        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 text-slate-300 text-xs font-mono font-semibold rounded shrink-0 shadow-xs"
        title="Indent Tab"
      >
        ⇥
      </button>

      <div className="w-px h-4 bg-slate-700 mx-0.5 shrink-0" />

      {commonKeys.map((k, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onInsert(k.insert, k.offset)}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 text-slate-200 text-xs font-mono font-medium rounded shrink-0 transition-colors shadow-xs"
        >
          {k.label}
        </button>
      ))}
    </div>
  );
};
