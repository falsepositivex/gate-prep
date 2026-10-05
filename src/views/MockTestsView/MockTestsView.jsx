import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import ScoreChart from '../../components/ScoreChart/ScoreChart.jsx';
import { istTodayIso } from '../../utils/ist.js';
import { Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TEST_TYPES = ['Full Mock', 'Subject Test', 'Weekly Quiz', 'PYQ Paper'];

export default function MockTestsView() {
  const { state, dispatch } = useApp();
  const [date, setDate] = useState(istTodayIso());
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [max, setMax] = useState('100');
  const [testType, setTestType] = useState(TEST_TYPES[0]);

  function handleAdd(e) {
    e.preventDefault();
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum)) { alert('Enter a score.'); return; }
    dispatch({
      type: 'ADD_TEST',
      payload: { date, name: name.trim() || 'Untitled test', score: scoreNum, max: parseFloat(max) || 100, testType }
    });
    setName('');
    setScore('');
  }

  const sorted = [...state.tests].sort((a, b) => new Date(a.date) - new Date(b.date));
  const tableRows = [...sorted].reverse();

  return (
    <div className="glass-panel p-3 sm:p-6 lg:p-8">
      <h2 className="font-head font-bold text-2xl text-white mb-2">Mock Test Tracker</h2>
      <p className="text-sm text-text-muted mb-8 max-w-3xl leading-relaxed">
        Log every weekly quiz, test series paper, or full mock. Score is out of 100 unless you change the max.
      </p>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-8 bg-surface-2 p-3 sm:p-5 rounded-xl border border-border-strong items-end">
        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Date</label>
          <input 
            type="date" 
            className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required
          />
        </div>
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Test name</label>
          <input 
            type="text" 
            placeholder="e.g. Test Series 4" 
            className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Score / Max</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              step="0.01"
              placeholder="62" 
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              value={score} 
              onChange={e => setScore(e.target.value)} 
            />
            <span className="text-text-muted font-mono">/</span>
            <input 
              type="number" 
              className="w-20 bg-surface-3 border border-border-strong rounded-md px-2 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-center"
              value={max} 
              onChange={e => setMax(e.target.value)} 
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Type</label>
          <select 
            className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            value={testType} 
            onChange={e => setTestType(e.target.value)}
          >
            {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="lg:col-span-1">
          <button 
            type="submit" 
            className="w-full bg-accent text-[#241300] font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-md hover:bg-[#ffb649] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(235,164,58,0.3)] hover:shadow-[0_0_20px_rgba(235,164,58,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-2 focus:ring-accent hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> Log
          </button>
        </div>
      </form>

      <ScoreChart tests={sorted} />

      <div className="mt-10 overflow-x-auto rounded-xl border border-border-subtle bg-surface-1 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-surface-2 border-b border-border-strong">
              <th className="font-mono text-[11px] text-text-muted font-medium p-2.5 sm:p-4 uppercase tracking-wider w-[100px] sm:w-[120px]">Date</th>
              <th className="font-mono text-[11px] text-text-muted font-medium p-2.5 sm:p-4 uppercase tracking-wider">Test Name</th>
              <th className="font-mono text-[11px] text-text-muted font-medium p-2.5 sm:p-4 uppercase tracking-wider hidden sm:table-cell">Type</th>
              <th className="font-mono text-[11px] text-text-muted font-medium p-2.5 sm:p-4 uppercase tracking-wider">Score</th>
              <th className="font-mono text-[11px] text-text-muted font-medium p-2.5 sm:p-4 uppercase tracking-wider">%</th>
              <th className="font-mono text-[11px] text-text-muted font-medium p-2.5 sm:p-4 uppercase tracking-wider text-right w-[60px] sm:w-[80px]">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tableRows.map((t, idx) => {
                const pct = Math.round((t.score / t.max) * 100);
                const scoreColor = pct >= 80 ? 'text-green' : pct < 40 ? 'text-red' : 'text-accent';
                
                return (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="border-b border-border-subtle last:border-0 hover:bg-surface-2/50 transition-colors group"
                  >
                    <td className="p-2.5 sm:p-4 text-sm text-text-muted font-mono">{t.date}</td>
                    <td className="p-2.5 sm:p-4 text-sm text-white font-medium">{t.name}</td>
                    <td className="p-2.5 sm:p-4 text-sm text-text-muted hidden sm:table-cell">
                      <span className="bg-surface-3 px-2 py-1 rounded text-xs border border-border-strong">{t.testType}</span>
                    </td>
                    <td className="p-2.5 sm:p-4 text-sm text-text-main font-mono">
                      {t.score}<span className="text-text-muted/50 text-xs">/{t.max}</span>
                    </td>
                    <td className={`p-2.5 sm:p-4 text-sm font-bold font-mono ${scoreColor}`}>{pct}%</td>
                    <td className="p-2.5 sm:p-4 text-right">
                      <button
                        className="p-2 rounded-md text-text-muted hover:text-red hover:bg-red/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                        onClick={() => {
                          if (window.confirm('Delete this mock test?')) {
                            dispatch({ type: 'DELETE_TEST', payload: { id: t.id } });
                          }
                        }}
                        title="Delete test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {tableRows.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-text-muted text-sm">
                  No tests logged yet. Your mock history will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
