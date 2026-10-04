import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import ChipFilter from '../../components/ChipFilter/ChipFilter.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { istTodayIso } from '../../utils/ist.js';
import { Plus, Trash2, CheckCircle2, Circle, AlertTriangle, BookOpen, Target, Video, PenTool, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const FILTER_OPTIONS = [
  { value: 'all',      label: 'All' },
  { value: 'open',     label: 'Still repeating' },
  { value: 'resolved', label: 'Fixed' },
];

const SOURCES = ['Mock Test', 'PYQ', 'DPP / Practice', 'Lecture', 'Other'];

const SourceIcon = ({ source, className }) => {
  switch (source) {
    case 'Mock Test': return <Target className={className} />;
    case 'PYQ': return <BookOpen className={className} />;
    case 'DPP / Practice': return <PenTool className={className} />;
    case 'Lecture': return <Video className={className} />;
    default: return <HelpCircle className={className} />;
  }
};

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
    <div className="glass-panel p-6 sm:p-8">
      <h2 className="font-head font-bold text-2xl text-white mb-2">Mistake Log</h2>
      <p className="text-sm text-text-muted mb-8 leading-relaxed max-w-3xl">
        Log every silly slip, concept gap, or repeated mock-test error here — from mocks, DPPs, PYQs, or lectures. Review this list before each test so you stop repeating the same ones.
      </p>

      <div className="glass-card p-5 sm:p-6 mb-8 border-red/20 bg-red/5">
        <h3 className="font-head font-bold text-lg text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red" />
          Log a mistake
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Date</label>
            <input 
              type="date" 
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-colors"
              value={date} 
              onChange={e => setDate(e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Subject</label>
            <select 
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-colors"
              value={subject} 
              onChange={e => setSubject(e.target.value)}
            >
              <option value="">General / not subject-specific</option>
              {SYLLABUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Source</label>
            <select 
              className="w-full bg-surface-3 border border-border-strong rounded-md px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-colors"
              value={source} 
              onChange={e => setSource(e.target.value)}
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">What went wrong</label>
          <textarea
            className="w-full min-h-[80px] bg-surface-3 border border-border-strong rounded-md p-3 text-sm text-text-main focus:outline-none focus:border-red focus:ring-1 focus:ring-red resize-y transition-colors placeholder:text-text-muted/50"
            placeholder="e.g. Mixed up worst-case and average-case for quicksort; picked O(n log n) instead of O(n²)."
            value={mistake}
            onChange={e => setMistake(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Correct approach / why</label>
          <textarea
            className="w-full min-h-[80px] bg-surface-3 border border-border-strong rounded-md p-3 text-sm text-text-main focus:outline-none focus:border-red focus:ring-1 focus:ring-red resize-y transition-colors placeholder:text-text-muted/50"
            placeholder="e.g. Worst case happens with already-sorted input + last-element pivot."
            value={fix}
            onChange={e => setFix(e.target.value)}
          />
        </div>
        <button
          className="bg-red text-[#2a1815] font-mono text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-md hover:bg-[#ff8686] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(248,113,113,0.3)] hover:shadow-[0_0_20px_rgba(248,113,113,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-2 focus:ring-red hover:scale-[1.02]"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" strokeWidth={3} /> Log mistake
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <ChipFilter options={FILTER_OPTIONS} active={filterMode} onChange={setFilterMode} />
        <select
          className="w-full sm:w-auto bg-surface-2 border border-border-strong rounded-full px-4 py-1.5 text-sm font-mono text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          value={subjFilter}
          onChange={e => setSubjFilter(e.target.value)}
        >
          <option value="">All subjects</option>
          {SYLLABUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-10 text-center flex flex-col items-center gap-3 border-2 border-dashed border-border-strong bg-transparent"
            >
              <CheckCircle2 className="w-8 h-8 text-green/50" />
              <p className="text-sm text-text-muted">No mistakes logged yet for this filter — nice, or get started above.</p>
            </motion.div>
          ) : items.map((m, idx) => {
            const subj = SYLLABUS.find(s => s.id === m.subject);
            return (
              <motion.div 
                key={m.id} 
                className={cn(
                  "glass-card p-5 relative overflow-hidden transition-all duration-300",
                  m.resolved ? "opacity-60 hover:opacity-100 bg-surface-2/30" : "border-red/20 shadow-[0_4px_20px_-10px_rgba(248,113,113,0.1)] hover:border-red/40"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                {!m.resolved && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-red" />
                )}
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="font-mono text-xs text-text-muted">{m.date}</span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-surface-3 text-white border border-border-subtle">
                    {subj ? subj.name : 'General'}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-surface-3 text-text-muted border border-border-subtle flex items-center gap-1.5">
                    <SourceIcon source={m.source} className="w-3 h-3" />
                    {m.source}
                  </span>
                  
                  <div className="flex-1" />
                  
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] font-bold tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-1",
                      m.resolved 
                        ? "bg-green/10 text-green border border-green/30 hover:bg-green/20 focus:ring-green" 
                        : "bg-red/10 text-red border border-red/30 hover:bg-red/20 focus:ring-red"
                    )}
                    onClick={() => dispatch({ type: 'TOGGLE_MISTAKE', payload: { id: m.id } })}
                  >
                    {m.resolved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    {m.resolved ? 'Fixed' : 'Still repeating'}
                  </button>
                  <button
                    className="p-1.5 rounded-md text-text-muted hover:text-red hover:bg-red/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red"
                    title="Delete mistake"
                    onClick={() => {
                      if (window.confirm('Delete this mistake?')) {
                        dispatch({ type: 'DELETE_MISTAKE', payload: { id: m.id } });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4 ml-1 pl-4 border-l-2 border-border-subtle">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5" /> What went wrong
                    </div>
                    <div className="text-[15px] text-white leading-relaxed whitespace-pre-wrap">{m.mistake}</div>
                  </div>
                  
                  {m.fix && (
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green" /> Correct approach / why
                      </div>
                      <div className="text-[15px] text-text-main leading-relaxed whitespace-pre-wrap bg-surface-2/50 p-3 rounded-lg border border-border-subtle">{m.fix}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
