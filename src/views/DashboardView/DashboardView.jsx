import { useApp } from '../../context/AppContext.jsx';
import AlertPanel from '../../components/AlertPanel/AlertPanel.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { subjectStats, computeStreak, last7NetHours, getRevCount, overallLectureStats, lectureStats } from '../../utils/stats.js';
import { BookOpen, CheckCircle2, Star, Target, Flame, Activity, AlertTriangle, Video, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardView() {
  const { state } = useApp();

  // Overall stats
  let totalStages = 0, doneStages = 0, totalTopics = 0, revisedTopics = 0, weakTopics = 0;
  SYLLABUS.forEach(subj => {
    const st = subjectStats(subj, state.topics);
    totalStages += st.total;
    doneStages  += st.done;
    totalTopics += st.topicCount;
    revisedTopics += st.revised;
    weakTopics += st.weak;
  });
  const pct = totalStages ? Math.round(doneStages / totalStages * 100) : 0;

  // Latest test
  let lastTestVal = '—', lastTestDetail = 'no tests logged yet';
  if (state.tests.length) {
    const sorted = [...state.tests].sort((a, b) => new Date(b.date) - new Date(a.date));
    const last = sorted[0];
    lastTestVal = `${last.score}/${last.max}`;
    lastTestDetail = `${last.name} · ${last.date}`;
  }

  const streak = computeStreak(state.logs);
  const net7 = last7NetHours(state.util);
  const openMistakes = state.mistakes.filter(m => !m.resolved).length;
  const lecOverall = overallLectureStats(state.lectures);

  return (
    <>
      <AlertPanel />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
        <StatCard
          label="Overall syllabus"
          value={pct + '%'}
          detail={`${doneStages} / ${totalStages} stages complete`}
          icon={BookOpen}
          index={0}
        >
          <div className="mt-3">
            <ProgressBar pct={pct} />
          </div>
        </StatCard>

        <StatCard
          label="Topics fully revised"
          value={revisedTopics}
          detail={`out of ${totalTopics} topics`}
          icon={CheckCircle2}
          index={1}
        />

        <StatCard
          label="Flagged weak topics"
          value={weakTopics}
          detail="tap the star in Syllabus Tracker to flag"
          icon={Star}
          index={2}
        />

        <StatCard
          label="Latest mock score"
          value={lastTestVal}
          detail={lastTestDetail}
          icon={Target}
          index={3}
        />

        <StatCard
          label="Study streak"
          value={streak}
          detail="consecutive days logged"
          icon={Flame}
          index={4}
        />

        <StatCard
          label="Net hours (last 7d)"
          value={(net7 >= 0 ? '+' : '') + net7.toFixed(1) + 'h'}
          detail={`studied − wasted, avg ${(net7 / 7).toFixed(1)}h/day`}
          icon={Activity}
          index={5}
        />

        <StatCard
          label="Open mistakes"
          value={openMistakes}
          detail={openMistakes === 0
            ? 'none open — nice, keep logging as you go'
            : 'still repeating · review before your next mock'}
          icon={AlertTriangle}
          index={6}
        />

        {lecOverall.total > 0 && (
          <StatCard
            label="Lectures completed"
            value={`${lecOverall.completed}/${lecOverall.total}`}
            detail={`${lecOverall.pct}% across ${lecOverall.subjects} subject${lecOverall.subjects !== 1 ? 's' : ''}`}
            icon={Video}
            index={7}
          >
            <div className="mt-3">
              <ProgressBar pct={lecOverall.pct} />
            </div>
          </StatCard>
        )}
      </div>

      <motion.div 
        className="glass-panel p-4 sm:p-6 lg:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="font-head font-bold text-xl sm:text-2xl text-white mb-2">Subject-wise progress</h2>
        <p className="text-sm text-text-muted mb-6 leading-relaxed max-w-3xl">
          Weighted by Lecture → Practice/DPP → PYQ → Revision. Weak-flagged subjects are marked with <Star className="inline w-3.5 h-3.5 text-accent fill-accent mx-1 -mt-0.5" />.
        </p>
        
        <div className="flex flex-col gap-1">
          {SYLLABUS.map((subj, index) => {
            const st = subjectStats(subj, state.topics);
            const revCount = getRevCount(state.revisions, subj.id);
            const lecSt = lectureStats(state.lectures, subj.id);
            return (
              <motion.div 
                key={subj.id} 
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-3 sm:py-4 border-b border-border-subtle last:border-0 hover:bg-surface-2/50 -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-lg transition-colors group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
              >
                <div className="sm:w-[220px] shrink-0">
                  <div className="font-semibold text-[15px] text-text-main group-hover:text-white transition-colors flex items-center gap-2 truncate">
                    {subj.name}
                    {st.weak > 0 && <Star className="w-3.5 h-3.5 text-accent fill-accent shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 font-mono text-[11px] text-text-muted">
                    {revCount > 0 && (
                      <span className="flex items-center text-purple"><RefreshCcw className="w-3 h-3 mr-1" />{revCount} rev</span>
                    )}
                    {lecSt.total > 0 && (
                      <span className="flex items-center text-cyan"><Video className="w-3 h-3 mr-1" />{lecSt.completed}/{lecSt.total}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 w-full mt-2 sm:mt-0 flex items-center gap-4">
                  <div className="flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <ProgressBar pct={st.pct} />
                  </div>
                  <div className="w-12 text-right font-mono text-sm font-medium text-text-main">{st.pct}%</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
