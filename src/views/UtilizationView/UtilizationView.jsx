import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import HeatmapGrid from '../../components/HeatmapGrid/HeatmapGrid.jsx';
import { istTodayIso } from '../../utils/ist.js';

export default function UtilizationView() {
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

  function selectDate(iso) {
    setActiveDate(iso);
  }

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

  // Summary stats
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
    <div className="sheet">
      <h2 className="section-title">Day Utilization Calendar</h2>
      <p className="section-note">
        Log hours studied vs. hours wasted. Greener = more productive net hours, redder = more time lost. Empty = no data yet.
      </p>

      <HeatmapGrid util={state.util} onCellClick={selectDate} activeDate={activeDate} />

      <section className="util-inline-form">
        <h3 className="form-title">Log Utilization</h3>
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

      {/* Summary cards */}
      <div className="util-summary" id="utilSummary">
        <div className="card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--cyan)', textTransform: 'uppercase' }}>Total studied</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '28.5px', fontWeight: 700, marginTop: '4px' }}>{studiedTotal.toFixed(1)}h</div>
        </div>
        <div className="card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--cyan)', textTransform: 'uppercase' }}>Total wasted</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '28.5px', fontWeight: 700, marginTop: '4px' }}>{wastedTotal.toFixed(1)}h</div>
        </div>
        <div className="card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--cyan)', textTransform: 'uppercase' }}>Days logged</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '28.5px', fontWeight: 700, marginTop: '4px' }}>{entries.length}</div>
        </div>
        <div className="card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--cyan)', textTransform: 'uppercase' }}>Best day</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '19px', fontWeight: 700, marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {bestDay ? `${bestDay.iso} (${bestDay.net >= 0 ? '+' : ''}${bestDay.net.toFixed(1)}h)` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
