import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import ChipFilter from '../../components/ChipFilter/ChipFilter.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { istTodayIso } from '../../utils/ist.js';

const FILTER_OPTIONS = [
  { value: 'all',      label: 'All' },
  { value: 'open',     label: 'Still repeating' },
  { value: 'resolved', label: 'Fixed' },
];

const SOURCES = ['Mock Test', 'PYQ', 'DPP / Practice', 'Lecture', 'Other'];

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export default function MistakesView() {
  const { state, dispatch } = useApp();
  const [date, setDate] = useState(istTodayIso());
  const [subject, setSubject] = useState('');
  const [source, setSource] = useState(SOURCES[0]);
  const [mistake, setMistake] = useState('');
  const [fix, setFix] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [subjFilter, setSubjFilter] = useState('');

  function handleAdd() {
    if (!mistake.trim()) { alert('Describe what went wrong.'); return; }
    dispatch({ type: 'ADD_MISTAKE', payload: { date, subject, source, mistake: mistake.trim(), fix: fix.trim() } });
    setMistake('');
    setFix('');
  }

  let items = [...state.mistakes].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (filterMode === 'open') items = items.filter(m => !m.resolved);
  if (filterMode === 'resolved') items = items.filter(m => m.resolved);
  if (subjFilter) items = items.filter(m => m.subject === subjFilter);

  return (
    <div className="sheet">
      <h2 className="section-title">Mistake Log</h2>
      <p className="section-note">
        Log every silly slip, concept gap, or repeated mock-test error here — from mocks, DPPs, PYQs, or lectures. Review this list before each test so you stop repeating the same ones.
      </p>

      <div className="mistake-form">
        <label>
          Date
          <input type="date" id="mDate" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Subject
          <select id="mSubject" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">General / not subject-specific</option>
            {SYLLABUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>
          Source
          <select id="mSource" value={source} onChange={e => setSource(e.target.value)}>
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          What went wrong
          <textarea
            id="mMistake"
            placeholder="e.g. Mixed up worst-case and average-case for quicksort; picked O(n log n) instead of O(n²)."
            value={mistake}
            onChange={e => setMistake(e.target.value)}
          />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Correct approach / why
          <textarea
            id="mFix"
            placeholder="e.g. Worst case happens with already-sorted input + last-element pivot."
            value={fix}
            onChange={e => setFix(e.target.value)}
          />
        </label>
        <button
          className="btn"
          id="addMistakeBtn"
          style={{ gridColumn: '1 / -1', justifySelf: 'start' }}
          onClick={handleAdd}
        >
          Log mistake
        </button>
      </div>

      <div className="toolbar">
        <ChipFilter options={FILTER_OPTIONS} active={filterMode} onChange={setFilterMode} />
        <select
          id="mistakeSubjFilter"
          style={{ marginLeft: 'auto' }}
          value={subjFilter}
          onChange={e => setSubjFilter(e.target.value)}
        >
          <option value="">All subjects</option>
          {SYLLABUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="mistake-list" id="mistakeList">
        {items.length === 0 ? (
          <p className="section-note">No mistakes logged yet for this filter — nice, or get started above.</p>
        ) : items.map(m => {
          const subj = SYLLABUS.find(s => s.id === m.subject);
          return (
            <div key={m.id} className={`mistake-card${m.resolved ? ' resolved' : ''}`}>
              <div className="mc-top">
                <span className="mc-date">{m.date}</span>
                {subj
                  ? <span className="mc-badge subj">{subj.name}</span>
                  : <span className="mc-badge">General</span>}
                <span className="mc-badge">{m.source}</span>
                <span className="mc-spacer" />
                <button
                  className={`mc-toggle${m.resolved ? ' on' : ''}`}
                  data-id={m.id}
                  onClick={() => dispatch({ type: 'TOGGLE_MISTAKE', payload: { id: m.id } })}
                >
                  {m.resolved ? '✓ Fixed' : 'Still repeating'}
                </button>
                <span
                  className="mc-del"
                  data-id={m.id}
                  onClick={() => dispatch({ type: 'DELETE_MISTAKE', payload: { id: m.id } })}
                >✕</span>
              </div>
              <div className="mc-label">What went wrong</div>
              <div
                className="mc-text"
                dangerouslySetInnerHTML={{ __html: escapeHtml(m.mistake) }}
              />
              {m.fix && (
                <>
                  <div className="mc-label">Correct approach / why</div>
                  <div
                    className="mc-text"
                    dangerouslySetInnerHTML={{ __html: escapeHtml(m.fix) }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
