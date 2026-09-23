import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { lectureStats } from '../../utils/stats.js';

export default function LectureTracker({ subjId }) {
  const { state, dispatch } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const data = state.lectures[subjId];
  const stats = lectureStats(state.lectures, subjId);
  const hasLectures = data && data.total > 0;

  function handleSetCount() {
    const num = parseInt(inputVal);
    if (!num || num < 1) return;
    dispatch({ type: 'SET_LECTURE_COUNT', payload: { subjId, total: num } });
    setEditing(false);
    setInputVal('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSetCount();
    if (e.key === 'Escape') { setEditing(false); setInputVal(''); }
  }

  function handleToggle(lecNum) {
    dispatch({ type: 'TOGGLE_LECTURE', payload: { subjId, lecNum } });
  }

  function handleClear() {
    if (window.confirm('Clear all lecture data for this subject?')) {
      dispatch({ type: 'CLEAR_LECTURES', payload: { subjId } });
      setExpanded(false);
      setEditing(false);
    }
  }

  function startEdit() {
    setInputVal(String(data?.total || ''));
    setEditing(true);
  }

  function handleCompleteAll() {
    dispatch({ type: 'COMPLETE_ALL_LECTURES', payload: { subjId } });
  }

  function handleResetAll() {
    if (window.confirm('Uncheck all lectures for this subject?')) {
      dispatch({ type: 'RESET_ALL_LECTURES', payload: { subjId } });
    }
  }

  // --- No lectures set: show setup prompt ---
  if (!hasLectures && !editing) {
    return (
      <div className="lecture-tracker lecture-setup">
        <span className="lecture-setup-icon">🎥</span>
        <span className="lecture-setup-text">Track lecture progress</span>
        <button
          className="btn ghost lecture-setup-btn"
          onClick={() => setEditing(true)}
        >
          + Set Lectures
        </button>
      </div>
    );
  }

  // --- Editing lecture count ---
  if (editing) {
    return (
      <div className="lecture-tracker lecture-edit">
        <span className="lecture-setup-icon">🎥</span>
        <label className="lecture-edit-label">
          Total lectures in the course:
        </label>
        <input
          type="number"
          className="lecture-edit-input"
          min="1"
          max="500"
          placeholder="e.g. 42"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button className="btn lecture-save-btn" onClick={handleSetCount}>
          Save
        </button>
        <button
          className="btn ghost lecture-cancel-btn"
          onClick={() => { setEditing(false); setInputVal(''); }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // --- Lectures set: summary + optional expanded checklist ---
  const completedCount = stats.completed;
  const totalCount = stats.total;
  const pct = stats.pct;

  // Build lecture rows
  const lectureRows = [];
  for (let i = 1; i <= totalCount; i++) {
    const ts = data.completed[i]; // timestamp or undefined
    lectureRows.push(
      <div
        key={i}
        className={`lecture-row${ts ? ' done' : ''}`}
        onClick={() => handleToggle(i)}
      >
        <span className="lecture-check">{ts ? '☑' : '☐'}</span>
        <span className="lecture-label">Lecture {i}</span>
        {ts && <span className="lecture-ts">{ts}</span>}
      </div>
    );
  }

  return (
    <div className="lecture-tracker lecture-main">
      {/* Summary bar — always visible */}
      <div className="lecture-summary" onClick={() => setExpanded(!expanded)}>
        <span className="lecture-setup-icon">🎥</span>
        <div className="lecture-summary-info">
          <div className="lecture-summary-top">
            <span className="lecture-summary-label">
              Lectures: <strong>{completedCount}/{totalCount}</strong>
            </span>
            <span className="lecture-summary-pct">{pct}%</span>
          </div>
          <div className="lecture-progress-bar">
            <div
              className="lecture-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="lecture-summary-actions">
          {completedCount < totalCount && (
            <button
              className="lecture-mark-all-btn"
              title="Mark all lectures as completed"
              onClick={e => { e.stopPropagation(); handleCompleteAll(); }}
            >
              ✓ All Done
            </button>
          )}
          {completedCount > 0 && (
            <button
              className="lecture-reset-all-btn"
              title="Uncheck all completed lectures"
              onClick={e => { e.stopPropagation(); handleResetAll(); }}
            >
              ✗ Uncheck All
            </button>
          )}
          <button
            className="lecture-action-btn"
            title="Edit lecture count"
            onClick={e => { e.stopPropagation(); startEdit(); }}
          >
            ✏️
          </button>
          <button
            className="lecture-action-btn"
            title="Clear all lecture data"
            onClick={e => { e.stopPropagation(); handleClear(); }}
          >
            🗑️
          </button>
          <span className="lecture-expand-arrow">
            {expanded ? '▴' : '▾'}
          </span>
        </div>
      </div>

      {/* Expanded checklist */}
      {expanded && (
        <div className="lecture-checklist">
          {lectureRows}
        </div>
      )}
    </div>
  );
}
