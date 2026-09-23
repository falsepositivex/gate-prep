import { useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import TopicRow from './TopicRow.jsx';
import LectureTracker from './LectureTracker.jsx';
import ProgressBar from '../ProgressBar/ProgressBar.jsx';
import { subjectStats, getRevCount, lectureStats } from '../../utils/stats.js';

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

  function handleNoteClick(e) { e.stopPropagation(); }

  return (
    <details className="subject" open={open}>
      <summary>
        <span className="summary-arrow" />
        <span className="summary-name">{subj.name}</span>
        <span className="summary-bar">
          <ProgressBar pct={stats.pct} />
        </span>
        <span className="summary-meta">
          {stats.pct}% · {stats.revised}/{stats.topicCount} revised
          {stats.weak ? ` · ★${stats.weak}` : ''}
          {revCount > 0 ? ` · 🔁×${revCount}` : ''}
          {lecStats.total > 0 ? ` · 🎥${lecStats.completed}/${lecStats.total}` : ''}
          {hasNote ? ' · 📝' : ''}
        </span>
      </summary>

      <div className="topic-list">
        {/* Revision counter row */}
        <div className="topic-row">
          <div className="topic-name">
            🔁 Full-subject revision count — <strong>{revCount}</strong>
          </div>
          <div className="stage-group">
            <button
              className="stage-btn"
              disabled={revCount <= 0}
              onClick={(e) => { e.preventDefault(); dispatch({ type: 'DEC_REVISION', payload: { subjId: subj.id } }); }}
            >−1</button>
            <button
              className="stage-btn on R"
              onClick={(e) => { e.preventDefault(); dispatch({ type: 'INC_REVISION', payload: { subjId: subj.id } }); }}
            >+1 Revision</button>
          </div>
        </div>

        {/* Lecture progress tracker */}
        <LectureTracker subjId={subj.id} />

        {/* Topic rows */}
        {topics.map(({ t, idx }) => (
          <TopicRow
            key={idx}
            subjId={subj.id}
            topicName={t}
            idx={idx}
          />
        ))}
      </div>

      {/* Notes */}
      <div className="subject-note">
        <div className="subject-note-label">📝 Notes — what's covered / important topics missed</div>
        <textarea
          className="subject-note-area"
          data-subj={subj.id}
          defaultValue={state.notes[subj.id] || ''}
          placeholder="e.g. Covered K-Map fully. Still need to redo Tabular method examples."
          onChange={handleNoteChange}
          onClick={handleNoteClick}
        />
      </div>
    </details>
  );
}
