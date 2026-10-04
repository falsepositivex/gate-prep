import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import HeatmapGrid from '../../components/HeatmapGrid/HeatmapGrid.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { istTodayIso } from '../../utils/ist.js';

// ─── Day Overview Sub-View ───────────────────────────────────────────────────
function DayOverview() {
  const { state, dispatch } = useApp();
  const [activeDate, setActiveDate] = useState(istTodayIso());
  const [studied, setStudied] = useState('');
  const [wasted, setWasted] = useState('');

  useEffect(() => {
    if (activeDate) {
      const u = state.util[activeDate] || {};
      setStudied(u.studied !== undefined ? String(u.studied) : '');
      setWasted(u.wasted !== undefined ? String(u.wasted) : '');
    } else {
      setStudied('');
      setWasted('');
    }
  }, [activeDate, state.util]);

  function handleSave() {
    if (!activeDate) return;
    dispatch({
      type: 'SET_UTIL_DAY',
      payload: {
        iso: activeDate,
        studied: parseFloat(studied) || 0,
        wasted: parseFloat(wasted) || 0
      }
    });
  }

  function handleClear() {
    if (!activeDate) return;
    if (window.confirm(`Clear utilization data for ${activeDate}?`)) {
      dispatch({ type: 'CLEAR_UTIL_DAY', payload: { iso: activeDate } });
    }
  }

  const entries = Object.entries(state.util);
  let studiedTotal = 0, wastedTotal = 0, bestDay = null;
  entries.forEach(([iso, u]) => {
    const s = parseFloat(u.studied) || 0;
    const w = parseFloat(u.wasted) || 0;
    studiedTotal += s;
    wastedTotal  += w;
    const net = s - w;
    if (!bestDay || net > bestDay.net) bestDay = { iso, net };
  });

  return (
    <>
      <p className="section-note">
        Log hours studied vs. hours wasted per day. Greener = more productive net hours, redder = more time lost.
      </p>

      <HeatmapGrid util={state.util} onCellClick={setActiveDate} activeDate={activeDate} />

      <section className="util-inline-form">
        <h3 className="form-title">
          <span className="form-title-icon">📅</span>
          Log for <span className="form-title-date">{activeDate}</span>
        </h3>
        <div className="util-form-grid">
          <label>
            Date
            <input
              type="date"
              value={activeDate}
              onChange={e => setActiveDate(e.target.value)}
            />
          </label>
          <label>
            Hours studied
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 4"
              value={studied}
              onChange={e => setStudied(e.target.value)}
            />
          </label>
          <label>
            Hours wasted
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 1.5"
              value={wasted}
              onChange={e => setWasted(e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button className="btn ghost" onClick={handleClear}>Clear Day</button>
            <button className="btn" onClick={handleSave}>Save</button>
          </div>
        </div>
      </section>

      <div className="util-summary" id="utilSummary">
        <div className="card util-stat-card">
          <div className="util-stat-label">Total studied</div>
          <div className="util-stat-value">{studiedTotal.toFixed(1)}h</div>
        </div>
        <div className="card util-stat-card">
          <div className="util-stat-label">Total wasted</div>
          <div className="util-stat-value">{wastedTotal.toFixed(1)}h</div>
        </div>
        <div className="card util-stat-card">
          <div className="util-stat-label">Days logged</div>
          <div className="util-stat-value">{entries.length}</div>
        </div>
        <div className="card util-stat-card">
          <div className="util-stat-label">Best day</div>
          <div className="util-stat-value util-stat-value--sm">
            {bestDay ? `${bestDay.iso} (${bestDay.net >= 0 ? '+' : ''}${bestDay.net.toFixed(1)}h)` : '—'}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Study Log Sub-View ──────────────────────────────────────────────────────
function StudyLog() {
  const { state, dispatch } = useApp();
  const [date, setDate] = useState(istTodayIso());
  const [hours, setHours] = useState('');
  const [subject, setSubject] = useState(SYLLABUS[0].id);
  const [note, setNote] = useState('');

  function handleAdd() {
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) { alert('Enter hours studied.'); return; }
    dispatch({ type: 'ADD_LOG', payload: { date, hours: hoursNum, subject, note } });
    setHours('');
    setNote('');
  }

  const sorted = [...state.logs].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Aggregate total hours by subject for quick summary
  const subjectTotals = {};
  state.logs.forEach(l => {
    subjectTotals[l.subject] = (subjectTotals[l.subject] || 0) + l.hours;
  });
  const totalHours = state.logs.reduce((s, l) => s + l.hours, 0);

  return (
    <>
      <p className="section-note">
        Log daily hours by subject to track where your time is actually going.
      </p>

      <div className="studylog-form-card">
        <h3 className="form-title">
          <span className="form-title-icon">➕</span>
          Add Entry
        </h3>
        <div className="log-form">
          <label>
            Date
            <input type="date" id="lDate" value={date} onChange={e => setDate(e.target.value)} />
          </label>
          <label>
            Hours
            <input
              type="number"
              step="0.5"
              id="lHours"
              placeholder="2.5"
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
          </label>
          <label>
            Subject
            <select id="lSubject" value={subject} onChange={e => setSubject(e.target.value)}>
              {SYLLABUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>
            Note
            <textarea
              id="lNote"
              placeholder="what you covered…"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button className="btn" id="addLogBtn" onClick={handleAdd}>Add entry</button>
          </div>
        </div>
      </div>

      {totalHours > 0 && (
        <div className="studylog-totals">
          <div className="studylog-totals-header">
            <span className="studylog-totals-title">Subject breakdown</span>
            <span className="studylog-totals-overall">{totalHours.toFixed(1)}h total</span>
          </div>
          <div className="studylog-totals-grid">
            {SYLLABUS.filter(s => subjectTotals[s.id] > 0).map(s => {
              const pct = Math.round((subjectTotals[s.id] / totalHours) * 100);
              return (
                <div key={s.id} className="studylog-subj-bar">
                  <div className="studylog-subj-meta">
                    <span className="studylog-subj-name">{s.name}</span>
                    <span className="studylog-subj-hrs">{subjectTotals[s.id].toFixed(1)}h · {pct}%</span>
                  </div>
                  <div className="studylog-bar-outer">
                    <div className="studylog-bar-inner" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="log-list" id="logList">
        {sorted.length === 0 ? (
          <p className="section-note" style={{ textAlign: 'center', padding: '24px 0' }}>
            No entries yet — add your first study session above.
          </p>
        ) : sorted.map(l => {
          const subj = SYLLABUS.find(s => s.id === l.subject);
          return (
            <div key={l.id} className="log-entry">
              <div className="log-entry-left">
                <div className="log-entry-date">{l.date}</div>
                <div className="log-entry-hrs">{l.hours}h</div>
              </div>
              <div className="log-entry-body">
                <div className="log-entry-subj">{subj ? subj.name : ''}</div>
                <div className="log-entry-note">
                  {l.note || <span style={{ color: 'var(--text-dim2)', fontStyle: 'italic' }}>no note</span>}
                </div>
              </div>
              <span
                className="del-x"
                data-id={l.id}
                title="Delete entry"
                onClick={() => {
                  if (window.confirm('Delete this study log entry?')) {
                    dispatch({ type: 'DELETE_LOG', payload: { id: l.id } });
                  }
                }}
              >✕</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Main View ───────────────────────────────────────────────────────────────
const INNER_TABS = [
  { id: 'overview', label: 'Day Overview', icon: '📊' },
  { id: 'studylog', label: 'Study Log',    icon: '📖' },
];

export default function UtilizationView() {
  const [innerTab, setInnerTab] = useState('overview');

  return (
    <div className="sheet">
      <h2 className="section-title">Day Log</h2>

      <div className="inner-tabs">
        {INNER_TABS.map(t => (
          <button
            key={t.id}
            className={`inner-tab-btn${innerTab === t.id ? ' active' : ''}`}
            onClick={() => setInnerTab(t.id)}
          >
            <span className="inner-tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="inner-tab-content">
        {innerTab === 'overview' && <DayOverview />}
        {innerTab === 'studylog' && <StudyLog />}
      </div>
    </div>
  );
}
