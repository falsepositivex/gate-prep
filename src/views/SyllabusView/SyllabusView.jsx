import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion.jsx';
import LectureTracker from '../../components/SubjectAccordion/LectureTracker.jsx';
import ChipFilter from '../../components/ChipFilter/ChipFilter.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { topicStatus, lectureStats, overallLectureStats } from '../../utils/stats.js';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Video, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

const FILTER_OPTIONS = [
  { value: 'all',        label: 'All' },
  { value: 'notstarted', label: 'Not started' },
  { value: 'inprogress', label: 'In progress' },
  { value: 'done',       label: 'Fully revised' },
  { value: 'weak',       label: 'Weak ★' },
];

const INNER_TABS = [
  { id: 'syllabus',  label: 'Syllabus',  icon: BookOpen },
  { id: 'lectures',  label: 'Lectures',  icon: Video },
];

function SyllabusTracker() {
  const { state } = useApp();
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const active = searchTerm.trim() || filterMode !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm text-text-muted mb-5 leading-relaxed max-w-3xl">
        Based on the official GATE 2027 CS/IT syllabus (IIT Madras). Click a stage tag to toggle it for that topic.
      </p>

      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-start lg:items-center">
        <div className="relative w-full lg:flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search a topic or subject…"
            className="w-full bg-surface-2 border border-border-strong rounded-full py-2 pl-9 pr-4 text-sm text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <ChipFilter options={FILTER_OPTIONS} active={filterMode} onChange={setFilterMode} />
      </div>

      <div className="flex flex-col gap-1">
        {SYLLABUS.map(subj => {
          const matchingTopics = subj.topics
            .map((t, idx) => ({ t, idx }))
            .filter(({ t, idx }) => {
              const key = subj.id + '::' + idx;
              const ts = state.topics[key] || { L: false, D: false, P: false, R: false, weak: false };
              const status = topicStatus(ts);
              if (filterMode === 'weak' && !ts.weak) return false;
              if (filterMode !== 'all' && filterMode !== 'weak' && status !== filterMode) return false;
              const normalizedSearch = searchTerm.trim().toLowerCase();
              if (normalizedSearch) {
                const hay = (subj.name + ' ' + t).toLowerCase();
                if (!hay.includes(normalizedSearch)) return false;
              }
              return true;
            });

          if (active && matchingTopics.length === 0) return null;

          const topicsToRender = active
            ? matchingTopics
            : subj.topics.map((t, idx) => ({ t, idx }));

          return (
            <SubjectAccordion
              key={subj.id}
              subj={subj}
              open={active}
              topics={topicsToRender}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function LecturesOverview() {
  const { state } = useApp();
  const lecOverall = overallLectureStats(state.lectures);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm text-text-muted mb-6 leading-relaxed max-w-3xl">
        Track your lecture progress subject-by-subject. Set the total count, then check off each lecture as you watch it.
      </p>

      {lecOverall.total > 0 && (
        <div className="glass-card p-5 border-cyan/20 bg-cyan/5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-cyan font-semibold mb-1">Overall lectures</div>
              <div className="font-head text-3xl font-bold text-white leading-none">
                {lecOverall.completed}<span className="text-white/30 text-xl font-normal mx-1">/</span>{lecOverall.total}
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md ml-auto">
            <div className="flex justify-between items-end mb-2 font-mono text-xs text-text-muted">
              <span>{lecOverall.subjects} subject{lecOverall.subjects !== 1 ? 's' : ''} tracked</span>
              <span className="text-cyan font-semibold text-sm">{lecOverall.pct}%</span>
            </div>
            <ProgressBar pct={lecOverall.pct} className="bg-cyan/10" indicatorClassName="bg-cyan" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {SYLLABUS.map(subj => {
          const stats = lectureStats(state.lectures, subj.id);
          return (
            <div key={subj.id} className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-surface-2 border-b border-border-subtle">
                <span className="font-semibold text-white truncate pr-4">{subj.name}</span>
                {stats.total > 0 && (
                  <span className="px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold tracking-wider uppercase bg-cyan/10 text-cyan shrink-0">
                    {stats.completed}/{stats.total} · {stats.pct}%
                  </span>
                )}
              </div>
              <LectureTracker subjId={subj.id} cardMode />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function SyllabusView() {
  const [innerTab, setInnerTab] = useState('syllabus');

  return (
    <div className="glass-panel p-6 sm:p-8">
      <h2 className="font-head font-bold text-2xl text-white mb-6">Syllabus Tracker</h2>

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
          {innerTab === 'syllabus' ? <SyllabusTracker key="syllabus" /> : <LecturesOverview key="lectures" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
