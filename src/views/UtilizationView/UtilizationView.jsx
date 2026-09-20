import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import HeatmapGrid from '../../components/HeatmapGrid/HeatmapGrid.jsx';
import Modal from '../../components/Modal/Modal.jsx';

export default function UtilizationView() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(null);
  const [studied, setStudied] = useState('');
  const [wasted, setWasted] = useState('');

  function openModal(iso) {
    setActiveDate(iso);
    const u = state.util[iso] || {};
    setStudied(u.studied !== undefined ? String(u.studied) : '');
    setWasted(u.wasted !== undefined ? String(u.wasted) : '');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setActiveDate(null);
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
    closeModal();
  }

  function handleClear() {
    if (!activeDate) return;
    dispatch({ type: 'CLEAR_UTIL_DAY', payload: { iso: activeDate } });
    closeModal();
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
        Click any day to log hours studied vs. hours wasted. Greener = more productive net hours, redder = more time lost. Empty = no data yet.
      </p>

      {/* Legend */}
      <div className="util-legend">
        <span>Less productive</span>
        <span className="sw u-r4" /><span className="sw u-r3" /><span className="sw u-r2" /><span className="sw u-r1" />
        <span className="sw" style={{ background: 'var(--bg-3)' }} />
        <span className="sw u-g1" /><span className="sw u-g2" /><span className="sw u-g3" /><span className="sw u-g4" />
        <span>More productive</span>
      </div>

      <HeatmapGrid util={state.util} onCellClick={openModal} />

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
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '19px', fontWeight: 700, marginTop: '4px' }}>
            {bestDay ? `${bestDay.iso} (${bestDay.net >= 0 ? '+' : ''}${bestDay.net.toFixed(1)}h)` : '—'}
          </div>
        </div>
      </div>

      {/* Utilization Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <h3>Log this day</h3>
        <div className="mdate">{activeDate}</div>
        <label htmlFor="modalStudied">Hours studied</label>
        <input
          type="number"
          step="0.5"
          min="0"
          id="modalStudied"
          placeholder="e.g. 4"
          value={studied}
          onChange={e => setStudied(e.target.value)}
        />
        <label htmlFor="modalWasted">Hours wasted</label>
        <input
          type="number"
          step="0.5"
          min="0"
          id="modalWasted"
          placeholder="e.g. 1.5"
          value={wasted}
          onChange={e => setWasted(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn ghost" id="modalClear" onClick={handleClear}>Clear day</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn ghost" id="modalCancel" onClick={closeModal}>Cancel</button>
            <button className="btn" id="modalSave" onClick={handleSave}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
