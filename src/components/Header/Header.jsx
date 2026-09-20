import { useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { istTodayIso } from '../../utils/ist.js';

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
          { topics: {}, tests: [], logs: [], util: {}, notes: {}, mistakes: [], revisions: {} },
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
    <header className="top">
      <div className="brand">
        <div className="tag">GATE CS Complete Prep</div>
        <h1>GATE 2027 — CS Prep Console</h1>
        <div className="sub">Akshay · Bengaluru</div>
      </div>
      <div className="header-right">
        <div className="io-btns">
          <button id="exportBtn" onClick={handleExport}>Export</button>
          <button id="importBtn" onClick={handleImportClick}>Import</button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </div>
    </header>
  );
}
