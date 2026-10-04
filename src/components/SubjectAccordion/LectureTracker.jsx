import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { lectureStats } from '../../utils/stats.js';

export default function LectureTracker({ subjId, cardMode = false }) {
  const { state, dispatch } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [startFromVal, setStartFromVal] = useState(1);

  const data = state.lectures[subjId];
  const stats = lectureStats(state.lectures, subjId);
  const hasLectures = data && data.total > 0;
  const currentStartFrom = data?.startFrom ?? 1;

  function handleSetCount() {
    const num = parseInt(inputVal);
    if (!num || num < 1) return;
    dispatch({ type: 'SET_LECTURE_COUNT', payload: { subjId, total: num, startFrom: startFromVal } });
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
    setStartFromVal(data?.startFrom ?? 1);
    setEditing(true);
  }

  function handleToggleStartFrom() {
    const newStart = currentStartFrom === 1 ? 0 : 1;
    dispatch({ type: 'SET_LECTURE_START', payload: { subjId, startFrom: newStart } });
  }

  function handleCompleteAll() {
    dispatch({ type: 'COMPLETE_ALL_LECTURES', payload: { subjId } });
  }

  function handleResetAll() {
    if (window.confirm('Uncheck all lectures for this subject?')) {
      dispatch({ type: 'RESET_ALL_LECTURES', payload: { subjId } });
    }
  }

  // Build lecture rows using 0-based internal indexing
  function buildLectureRows() {
    const rows = [];
    const totalCount = stats.total;
    for (let i = 0; i < totalCount; i++) {
      const ts = data.completed[i];
      const displayNum = currentStartFrom === 0 ? i : i + 1;
      rows.push(
        <div
          key={i}
          className={`lecture-row${ts ? ' done' : ''}`}
          onClick={() => handleToggle(i)}
        >
          <span className="lecture-check">{ts ? '☑' : '☐'}</span>
          <span className="lecture-label">Lecture {displayNum}</span>
          {ts && <span className="lecture-ts">{ts}</span>}
        </div>
      );
    }
    return rows;
  }

  // ── No lectures set: setup prompt ──────────────────────────────────────────
  if (!hasLectures && !editing) {
    if (cardMode) {
      return (
        <div className="lec-card-setup">
          <span className="lec-card-setup-text">No lectures set yet</span>
          <button
            className="btn ghost lec-card-setup-btn"
            onClick={() => setEditing(true)}
          >
            + Set Count
          </button>
        </div>
      );
    }
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

  // ── Editing lecture count ──────────────────────────────────────────────────
  if (editing) {
    const editContent = (
      <div className={cardMode ? 'lec-card-edit' : 'lecture-tracker lecture-edit'}>
        {!cardMode && <span className="lecture-setup-icon">🎥</span>}
        <label className="lecture-edit-label">Total lectures in the course:</label>
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
        <div className="lecture-edit-radio-group">
          <span className="lecture-edit-radio-label">Start from:</span>
          <label className="lecture-edit-radio-opt">
            <input
              type="radio"
              name={`startFrom-${subjId}`}
              checked={startFromVal === 0}
              onChange={() => setStartFromVal(0)}
            />
            0
          </label>
          <label className="lecture-edit-radio-opt">
            <input
              type="radio"
              name={`startFrom-${subjId}`}
              checked={startFromVal === 1}
              onChange={() => setStartFromVal(1)}
            />
            1
          </label>
        </div>
        <div className="lecture-edit-actions">
          <button className="btn lecture-save-btn" onClick={handleSetCount}>Save</button>
          <button
            className="btn ghost lecture-cancel-btn"
            onClick={() => { setEditing(false); setInputVal(''); }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
    return editContent;
  }

  // ── Lectures set: summary + optional checklist ─────────────────────────────
  const { completed: completedCount, total: totalCount, pct } = stats;

  if (cardMode) {
    // Card-mode: compact summary + inline checklist toggle
    return (
      <div className="lec-card-main">
        <div className="lec-card-summary" onClick={() => setExpanded(!expanded)}>
          <div className="lec-card-counts">
            <span className="lec-card-done">{completedCount}</span>
            <span className="lec-card-sep">/</span>
            <span className="lec-card-total">{totalCount}</span>
            <span className="lec-card-pct">{pct}%</span>
          </div>
          <div className="lec-card-bar-outer">
            <div className="lec-card-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="lec-card-actions">
            {completedCount < totalCount && (
              <button
                className="lecture-mark-all-btn"
                title="Mark all as done"
                onClick={e => { e.stopPropagation(); handleCompleteAll(); }}
              >
                ✓ All
              </button>
            )}
            {completedCount > 0 && (
              <button
                className="lecture-reset-all-btn"
                title="Uncheck all"
                onClick={e => { e.stopPropagation(); handleResetAll(); }}
              >
                ✗
              </button>
            )}
            <button
              className="lecture-action-btn"
              title={`${currentStartFrom}-based numbering`}
              onClick={e => { e.stopPropagation(); handleToggleStartFrom(); }}
            >
              #{currentStartFrom}
            </button>
            <button
              className="lecture-action-btn"
              title="Edit count"
              onClick={e => { e.stopPropagation(); startEdit(); }}
            >
              ✏️
            </button>
            <button
              className="lecture-action-btn"
              title="Clear data"
              onClick={e => { e.stopPropagation(); handleClear(); }}
            >
              🗑️
            </button>
            <span className="lecture-expand-arrow">{expanded ? '▴' : '▾'}</span>
          </div>
        </div>
        {expanded && (
          <div className="lecture-checklist">
            {buildLectureRows()}
          </div>
        )}
      </div>
    );
  }

  // Default (accordion-embedded) mode
  return (
    <div className="lecture-tracker lecture-main">
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
            className="lecture-action-btn lecture-toggle-base-btn"
            title={`Currently ${currentStartFrom}-based. Click to switch to ${currentStartFrom === 1 ? '0' : '1'}-based.`}
            onClick={e => { e.stopPropagation(); handleToggleStartFrom(); }}
            style={{ fontWeight: 'bold', fontSize: '0.85rem' }}
          >
            [#{currentStartFrom}]
          </button>
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

      {expanded && (
        <div className="lecture-checklist">
          {buildLectureRows()}
        </div>
      )}
    </div>
  );
}
