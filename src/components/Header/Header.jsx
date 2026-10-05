import { useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Download, Upload } from 'lucide-react';

export default function Header() {
  const { state, dispatch } = useApp();
  const importRef = useRef(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gate2027-tracker-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    importRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const newState = Object.assign(
          { topics: {}, tests: [], logs: [], util: {}, notes: {}, mistakes: [], revisions: {}, lectures: {} },
          parsed
        );
        dispatch({ type: 'IMPORT_STATE', payload: { newState } });
        alert('Import successful.');
      } catch {
        alert('Could not read that file — make sure it\'s a backup exported from this tool.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border-subtle relative z-10">
      <div className="flex flex-col gap-1">
        <div className="font-mono text-xs tracking-[0.15em] text-cyan uppercase font-semibold">GATE CS Complete Prep</div>
        <h1 className="font-head font-bold text-3xl md:text-4xl leading-tight text-white tracking-tight">
          GATE 2027 <span className="text-white/30 font-normal">—</span> CS Prep Console
        </h1>
      </div>
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-surface-2 hover:bg-surface-3 border border-border-strong rounded-md text-text-muted hover:text-white transition-all duration-200 text-xs font-mono uppercase tracking-wider group focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/50"
        >
          <Download className="w-4 h-4 group-hover:text-amber transition-colors" />
          <span>Export</span>
        </button>
        <button 
          onClick={handleImportClick}
          className="flex items-center gap-2 px-3 py-2 bg-surface-2 hover:bg-surface-3 border border-border-strong rounded-md text-text-muted hover:text-white transition-all duration-200 text-xs font-mono uppercase tracking-wider group focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/50"
        >
          <Upload className="w-4 h-4 group-hover:text-cyan transition-colors" />
          <span>Import</span>
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>
    </header>
  );
}
