import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { istTodayIso } from '../../utils/ist.js';

export default function StudyLogView() {
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

  return (
    <div className="sheet">
      <h2 className="section-title">Study Log</h2>
      <p className="section-note">
        Log daily hours by subject to see where your time is actually going. For the day-level green/red overview, use the Utilization tab.
      </p>

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
            placeholder="what you covered"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </label>
        <button className="btn" id="addLogBtn" onClick={handleAdd}>Add entry</button>
      </div>

      <div className="log-list" id="logList">
        {sorted.map(l => {
          const subj = SYLLABUS.find(s => s.id === l.subject);
          return (
            <div key={l.id} className="log-entry">
              <div className="date">{l.date}</div>
              <div className="hrs">{l.hours}h</div>
              <div className="body">
                {l.note || <span style={{ color: 'var(--text-dim2)' }}>no note</span>}
                <div className="subj">{subj ? subj.name : ''}</div>
              </div>
              <span
                className="del-x"
                data-id={l.id}
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
    </div>
  );
}
