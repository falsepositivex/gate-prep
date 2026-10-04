import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import HeatmapGrid from '../../components/HeatmapGrid/HeatmapGrid.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { istTodayIso } from '../../utils/ist.js';
import { Calendar as CalendarIcon, Clock, Save, Trash2, Plus, BookOpen, Activity, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm text-text-muted mb-6 leading-relaxed max-w-3xl">
        Log hours studied vs. hours wasted per day. Greener = more productive net hours, redder = more time lost.
      </p>

      <HeatmapGrid util={state.util} onCellClick={setActiveDate} activeDate={activeDate} />

      <section className="glass-card p-5 sm:p-6 mb-8 border-accent/20 bg-accent/5">
        <h3 className="font-head font-bold text-lg text-white mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-accent" />
          Log for <span className="text-accent">{activeDate}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Date</label>
            <input
              type="date"
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              value={activeDate}
              onChange={e => setActiveDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Hours studied</label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 4"
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              value={studied}
              onChange={e => setStudied(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Hours wasted</label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 1.5"
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-colors"
              value={wasted}
              onChange={e => setWasted(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              className="flex-1 bg-surface-3 text-text-muted font-mono text-xs font-semibold uppercase tracking-wider py-2.5 px-3 rounded-md hover:text-white hover:bg-surface-2 border border-border-strong transition-colors flex items-center justify-center gap-1.5"
              onClick={handleClear}
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
            <button 
              className="flex-1 bg-accent text-[#241300] font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-md hover:bg-[#ffb649] transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(235,164,58,0.3)]"
              onClick={handleSave}
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-2">Total studied</div>
          <div className="font-head text-3xl font-bold text-green">{studiedTotal.toFixed(1)}h</div>
        </div>
        <div className="glass-card p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-2">Total wasted</div>
          <div className="font-head text-3xl font-bold text-red">{wastedTotal.toFixed(1)}h</div>
        </div>
        <div className="glass-card p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-2">Days logged</div>
          <div className="font-head text-3xl font-bold text-white">{entries.length}</div>
        </div>
        <div className="glass-card p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-2">Best day</div>
          <div className="font-mono text-sm sm:text-base font-semibold text-accent mt-1">
            {bestDay ? `${bestDay.iso}\n(${bestDay.net >= 0 ? '+' : ''}${bestDay.net.toFixed(1)}h)` : '—'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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

  const subjectTotals = {};
  state.logs.forEach(l => {
    subjectTotals[l.subject] = (subjectTotals[l.subject] || 0) + l.hours;
  });
  const totalHours = state.logs.reduce((s, l) => s + l.hours, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm text-text-muted mb-6 leading-relaxed max-w-3xl">
        Log daily hours by subject to track where your time is actually going.
      </p>

      <div className="glass-card p-5 sm:p-6 mb-8">
        <h3 className="font-head font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-accent" />
          Add Entry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Date</label>
            <input 
              type="date" 
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              value={date} 
              onChange={e => setDate(e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Hours</label>
            <input
              type="number"
              step="0.5"
              placeholder="2.5"
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Subject</label>
            <select 
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              value={subject} 
              onChange={e => setSubject(e.target.value)}
            >
              {SYLLABUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-4 lg:col-span-1 lg:col-start-1 lg:col-end-5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Note (Optional)</label>
            <input
              type="text"
              placeholder="what you covered…"
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 lg:col-span-1">
            <button 
              className="w-full bg-accent text-[#241300] font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-md hover:bg-[#ffb649] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(235,164,58,0.3)] hover:shadow-[0_0_20px_rgba(235,164,58,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-2 focus:ring-accent hover:scale-[1.02]"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4" strokeWidth={3} /> Add
            </button>
          </div>
        </div>
      </div>

      {totalHours > 0 && (
        <div className="glass-card p-5 sm:p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <span className="font-head font-bold text-lg text-white">Subject breakdown</span>
            <span className="font-mono text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">{totalHours.toFixed(1)}h total</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SYLLABUS.filter(s => subjectTotals[s.id] > 0).map((s, idx) => {
              const pct = Math.round((subjectTotals[s.id] / totalHours) * 100);
              return (
                <motion.div 
                  key={s.id} 
                  className="bg-surface-2 p-3 rounded-lg border border-border-subtle"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-white truncate pr-2">{s.name}</span>
                    <span className="font-mono text-[11px] text-text-muted shrink-0">{subjectTotals[s.id].toFixed(1)}h · <span className="text-accent">{pct}%</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="font-head font-bold text-lg text-white mb-2">Study History</h3>
        {sorted.length === 0 ? (
          <div className="glass-card p-10 text-center flex flex-col items-center gap-3">
            <BookOpen className="w-8 h-8 text-text-muted/50" />
            <p className="text-sm text-text-muted">No entries yet — add your first study session above.</p>
          </div>
        ) : sorted.map((l, idx) => {
          const subj = SYLLABUS.find(s => s.id === l.subject);
          return (
            <motion.div 
              key={l.id} 
              className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-4 min-w-[140px] shrink-0">
                <div className="font-mono text-xs text-text-muted bg-surface-2 px-2 py-1 rounded border border-border-subtle">{l.date}</div>
                <div className="font-mono font-bold text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20">{l.hours}h</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm mb-1">{subj ? subj.name : ''}</div>
                <div className="text-sm text-text-muted truncate">
                  {l.note || <span className="italic opacity-50">no note</span>}
                </div>
              </div>
              <button
                className="p-2 rounded-md text-text-muted hover:text-red hover:bg-red/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none shrink-0 self-end sm:self-center"
                title="Delete entry"
                onClick={() => {
                  if (window.confirm('Delete this study log entry?')) {
                    dispatch({ type: 'DELETE_LOG', payload: { id: l.id } });
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

const INNER_TABS = [
  { id: 'overview', label: 'Day Overview', icon: BarChart2 },
  { id: 'studylog', label: 'Study Log',    icon: BookOpen },
];

export default function UtilizationView() {
  const [innerTab, setInnerTab] = useState('overview');

  return (
    <div className="glass-panel p-6 sm:p-8">
      <h2 className="font-head font-bold text-2xl text-white mb-6">Day Log</h2>

      <div className="flex gap-2 mb-8 bg-surface-2 p-1 rounded-lg w-full max-w-sm border border-border-strong">
        {INNER_TABS.map(t => {
          const Icon = t.icon;
          const isActive = innerTab === t.id;
          return (
            <button
              key={t.id}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-mono text-xs font-semibold tracking-wider transition-all duration-200 uppercase",
                isActive 
                  ? "bg-surface-3 text-cyan shadow-sm border border-border-subtle" 
                  : "text-text-muted hover:text-white hover:bg-surface-3/50 border border-transparent"
              )}
              onClick={() => setInnerTab(t.id)}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {innerTab === 'overview' ? <DayOverview key="overview" /> : <StudyLog key="studylog" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
