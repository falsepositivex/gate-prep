import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { lectureStats } from '../../utils/stats.js';
import { Video, Settings2, Trash2, CheckCircle2, Circle, CheckSquare, Square, Check, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

  function buildLectureRows() {
    const rows = [];
    const totalCount = stats.total;
    for (let i = 0; i < totalCount; i++) {
      const ts = data.completed[i];
      const displayNum = currentStartFrom === 0 ? i : i + 1;
      rows.push(
        <button
          key={i}
          className={cn(
            "flex items-center gap-2.5 w-full px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-md transition-colors focus:outline-none focus-visible:bg-surface-3 text-left group border-l-2",
            ts
              ? "bg-cyan/5 hover:bg-cyan/10 border-l-cyan/50"
              : "hover:bg-surface-3 border-l-transparent hover:border-l-border-strong"
          )}
          onClick={() => handleToggle(i)}
        >
          {ts ? (
            <CheckSquare className="w-4 h-4 text-cyan shrink-0 transition-transform group-hover:scale-110" />
          ) : (
            <Square className="w-4 h-4 text-text-muted shrink-0 transition-transform group-hover:scale-110" />
          )}
          <span className={cn("text-sm font-medium flex-1", ts ? "text-cyan" : "text-text-main group-hover:text-white")}>
            Lecture {displayNum}
          </span>
          {ts && <span className="font-mono text-[11px] text-text-muted ml-auto pl-2 shrink-0">{ts}</span>}
        </button>
      );
    }
    return rows;
  }

  // ── No lectures set ──────────────────────────────────────────────────────────
  if (!hasLectures && !editing) {
    return (
      <div className={cn("flex flex-col sm:flex-row items-center gap-4 p-4", cardMode ? "" : "border-b border-border-subtle")}>
        <div className="flex items-center gap-2 text-text-muted flex-1 text-sm font-medium">
          <Video className="w-4 h-4" />
          Track lecture progress
        </div>
        <button
          className="px-4 py-1.5 rounded-md font-mono text-xs border border-border-strong bg-surface-2 text-text-main hover:text-white hover:bg-surface-3 transition-colors"
          onClick={() => setEditing(true)}
        >
          + Set Lectures
        </button>
      </div>
    );
  }

  // ── Editing lecture count ──────────────────────────────────────────────────
  if (editing) {
    return (
      <div className={cn("p-4 flex flex-col gap-4", cardMode ? "" : "border-b border-border-subtle")}>
        <div className="flex items-center gap-2 text-text-main text-sm font-medium">
          {!cardMode && <Video className="w-4 h-4 text-text-muted" />}
          Total lectures in the course:
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            className="w-full sm:w-32 bg-surface-3 border border-border-strong rounded-md p-2 text-sm text-text-main focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/50"
            min="1"
            max="500"
            placeholder="e.g. 42"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Start from:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-text-main hover:text-white">
              <input
                type="radio"
                name={`startFrom-${subjId}`}
                checked={startFromVal === 0}
                onChange={() => setStartFromVal(0)}
                className="accent-cyan w-3.5 h-3.5"
              />
              0
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-text-main hover:text-white">
              <input
                type="radio"
                name={`startFrom-${subjId}`}
                checked={startFromVal === 1}
                onChange={() => setStartFromVal(1)}
                className="accent-cyan w-3.5 h-3.5"
              />
              1
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-md font-mono text-xs font-semibold bg-cyan text-[#0f1117] hover:bg-[#93dceb] transition-colors" onClick={handleSetCount}>
            Save
          </button>
          <button
            className="px-4 py-1.5 rounded-md font-mono text-xs border border-border-strong bg-transparent text-text-muted hover:text-white hover:bg-surface-3 transition-colors"
            onClick={() => { setEditing(false); setInputVal(''); }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Lectures set: summary + checklist ─────────────────────────────
  const { completed: completedCount, total: totalCount, pct } = stats;

  return (
    <div className={cn("flex flex-col", cardMode ? "" : "border-b border-border-subtle")}>
      <div 
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer hover:bg-surface-2 transition-colors",
          cardMode ? "px-3 sm:px-4 hover:bg-surface-2/60" : ""
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
          {!cardMode && <Video className="w-4 h-4 text-cyan shrink-0" />}
          <div className="flex flex-col w-full">
            <div className="flex items-baseline justify-between sm:justify-start gap-3">
              <span className="text-sm font-medium text-text-main">
                Lectures: <strong className="text-cyan">{completedCount}/{totalCount}</strong>
              </span>
              <span className="font-mono text-xs text-text-muted">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full sm:w-48 bg-white/10 rounded-full overflow-hidden shrink-0">
              <div className="h-full bg-cyan transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {completedCount < totalCount && (
            <button
              className="px-2.5 py-1 rounded-md font-mono text-[10px] uppercase font-semibold text-green border border-green/30 hover:bg-green/10 transition-colors flex items-center gap-1"
              title="Mark all as done"
              onClick={e => { e.stopPropagation(); handleCompleteAll(); }}
            >
              <Check className="w-3 h-3" /> All
            </button>
          )}
          {completedCount > 0 && (
            <button
              className="px-2.5 py-1 rounded-md font-mono text-[10px] uppercase font-semibold text-red border border-red/30 hover:bg-red/10 transition-colors flex items-center gap-1"
              title="Uncheck all"
              onClick={e => { e.stopPropagation(); handleResetAll(); }}
            >
              <X className="w-3 h-3" /> None
            </button>
          )}
          <div className="w-px h-4 bg-border-strong mx-1 hidden sm:block" />
          <button
            className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-surface-3 transition-colors"
            title={`Currently ${currentStartFrom}-based numbering`}
            onClick={e => { e.stopPropagation(); handleToggleStartFrom(); }}
          >
            <span className="font-mono text-[11px] font-bold px-1">#{currentStartFrom}</span>
          </button>
          <button
            className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-surface-3 transition-colors"
            title="Edit count"
            onClick={e => { e.stopPropagation(); startEdit(); }}
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-md text-text-muted hover:text-red hover:bg-red/10 transition-colors"
            title="Clear data"
            onClick={e => { e.stopPropagation(); handleClear(); }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronDown className={cn("w-4 h-4 ml-1 text-text-muted transition-transform duration-300", expanded && "rotate-180")} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "flex flex-col gap-0.5 px-3 pb-3 pt-0.5 sm:px-4 sm:pb-4",
              cardMode ? "px-2 sm:px-3" : ""
            )}>
              {buildLectureRows()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
