import { useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import TopicRow from './TopicRow.jsx';
import LectureTracker from './LectureTracker.jsx';
import ProgressBar from '../ProgressBar/ProgressBar.jsx';
import { subjectStats, getRevCount, lectureStats } from '../../utils/stats.js';
import { ChevronDown, Star, RefreshCcw, Video, FileText } from 'lucide-react';

export default function SubjectAccordion({ subj, open, topics }) {
  const { state, dispatch } = useApp();
  const debounceRef = useRef(null);

  const stats = subjectStats(subj, state.topics);
  const revCount = getRevCount(state.revisions, subj.id);
  const hasNote = (state.notes[subj.id] || '').trim().length > 0;
  const lecStats = lectureStats(state.lectures, subj.id);

  function handleNoteChange(e) {
    const text = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch({ type: 'UPDATE_NOTE', payload: { subjId: subj.id, text } });
    }, 350);
  }

  return (
    <details className="group glass-card mb-3 overflow-hidden transition-all duration-300" open={open}>
      <summary className="flex items-center gap-3 p-4 cursor-pointer bg-surface-2 hover:bg-surface-3 transition-colors list-none [&::-webkit-details-marker]:hidden focus:outline-none focus-visible:bg-surface-3 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50">
        <ChevronDown className="w-5 h-5 text-text-muted transition-transform duration-300 group-open:rotate-180 shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="font-head font-semibold text-[17px] text-white truncate flex items-center gap-2">
            {subj.name}
            {stats.weak > 0 && <Star className="w-4 h-4 text-accent fill-accent shrink-0" />}
          </div>
          <div className="font-mono text-xs text-text-muted mt-1 truncate flex items-center gap-2.5">
            <span className="text-white/80">{stats.pct}%</span>
            <span className="opacity-50">·</span>
            <span>{stats.revised}/{stats.topicCount} rev</span>
            {revCount > 0 && (
              <>
                <span className="opacity-50">·</span>
                <span className="flex items-center text-purple"><RefreshCcw className="w-3 h-3 mr-1" />{revCount}</span>
              </>
            )}
            {lecStats.total > 0 && (
              <>
                <span className="opacity-50">·</span>
                <span className="flex items-center text-cyan"><Video className="w-3 h-3 mr-1" />{lecStats.completed}/{lecStats.total}</span>
              </>
            )}
            {hasNote && (
              <>
                <span className="opacity-50">·</span>
                <FileText className="w-3.5 h-3.5 text-green" />
              </>
            )}
          </div>
        </div>

        <div className="w-[80px] sm:w-[120px] hidden sm:block shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <ProgressBar pct={stats.pct} />
        </div>
      </summary>

      <div className="p-4 pt-0 border-t border-border-subtle bg-surface-1/50">
        {/* Rev Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-border-subtle">
          <div className="text-sm flex items-center gap-2.5 text-text-main">
            <RefreshCcw className="w-4 h-4 text-purple" />
            <span>Full-subject revision count <span className="opacity-40 px-1">—</span> <strong className="text-purple text-base font-head">{revCount}</strong></span>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-md font-mono text-xs border border-border-strong bg-surface-2 text-text-muted hover:text-white hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              disabled={revCount <= 0}
              onClick={(e) => { e.preventDefault(); dispatch({ type: 'DEC_REVISION', payload: { subjId: subj.id } }); }}
            >−1</button>
            <button
              className="px-3 py-1.5 rounded-md font-mono text-xs bg-purple/10 border border-purple/30 text-purple hover:bg-purple/20 transition-all font-medium flex items-center gap-1.5"
              onClick={(e) => { e.preventDefault(); dispatch({ type: 'INC_REVISION', payload: { subjId: subj.id } }); }}
            >
              <RefreshCcw className="w-3 h-3" /> +1 Rev
            </button>
          </div>
        </div>

        <LectureTracker subjId={subj.id} />

        <div className="mt-2 divide-y divide-border-subtle/50">
          {topics.map(({ t, idx }) => (
            <TopicRow
              key={idx}
              subjId={subj.id}
              topicName={t}
              idx={idx}
            />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border-subtle">
          <div className="font-mono text-[11.5px] uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Notes / Concepts to revisit
          </div>
          <textarea
            className="w-full min-h-[80px] bg-surface-3/50 border border-border-strong rounded-md p-3 text-sm text-text-main focus:outline-none focus:border-accent focus:bg-surface-3 focus:ring-1 focus:ring-accent/50 resize-y transition-all placeholder:text-text-muted/40 leading-relaxed"
            defaultValue={state.notes[subj.id] || ''}
            placeholder="e.g. Covered K-Map fully. Still need to redo Tabular method examples."
            onChange={handleNoteChange}
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    </details>
  );
}
