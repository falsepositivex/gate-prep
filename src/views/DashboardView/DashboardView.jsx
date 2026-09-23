import { useApp } from '../../context/AppContext.jsx';
import AlertPanel from '../../components/AlertPanel/AlertPanel.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { subjectStats, computeStreak, last7NetHours, getRevCount, overallLectureStats, lectureStats } from '../../utils/stats.js';

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

      <div className="dash-grid">
        <StatCard
          label="Overall syllabus"
          value={pct + '%'}
          detail={`${doneStages} / ${totalStages} stages complete`}
        >
          <div style={{ marginTop: '10px' }}>
            <ProgressBar pct={pct} />
          </div>
        </StatCard>

        <StatCard
          label="Topics fully revised"
          value={revisedTopics}
          detail={`out of ${totalTopics} topics`}
        />

        <StatCard
          label="Flagged weak topics"
          value={weakTopics}
          detail="tap the star in Syllabus Tracker to flag"
        />

        <StatCard
          label="Latest mock score"
          value={lastTestVal}
          detail={lastTestDetail}
        />

        <StatCard
          label="Study streak"
          value={streak}
          detail="consecutive days logged"
        />

        <StatCard
          label="Net hours (last 7d)"
          value={(net7 >= 0 ? '+' : '') + net7.toFixed(1) + 'h'}
          detail={`studied − wasted, avg ${(net7 / 7).toFixed(1)}h/day`}
        />

        <StatCard
          label="Open mistakes"
          value={openMistakes}
          detail={openMistakes === 0
            ? 'none open — nice, keep logging as you go'
            : 'still repeating · review before your next mock'}
        />

        {lecOverall.total > 0 && (
          <StatCard
            label="Lectures completed"
            value={`${lecOverall.completed}/${lecOverall.total}`}
            detail={`${lecOverall.pct}% across ${lecOverall.subjects} subject${lecOverall.subjects !== 1 ? 's' : ''}`}
          >
            <div style={{ marginTop: '10px' }}>
              <ProgressBar pct={lecOverall.pct} />
            </div>
          </StatCard>
        )}
      </div>

      <div className="sheet">
        <h2 className="section-title">Subject-wise progress</h2>
        <p className="section-note">
          Weighted by Lecture → Practice/DPP → PYQ → Revision. Weak-flagged subjects are marked with ★.
        </p>
        <div id="subjectBars">
          {SYLLABUS.map(subj => {
            const st = subjectStats(subj, state.topics);
            const revCount = getRevCount(state.revisions, subj.id);
            const lecSt = lectureStats(state.lectures, subj.id);
            return (
              <div key={subj.id} className="subject-row">
                <div className="name">
                  {subj.name}
                  {st.weak > 0 && <span style={{ color: 'var(--amber)' }}> ★</span>}
                  {revCount > 0 && <span style={{ color: 'var(--purple)' }}> 🔁{revCount}</span>}
                  {lecSt.total > 0 && <span style={{ color: 'var(--cyan)' }}> 🎥{lecSt.completed}/{lecSt.total}</span>}
                </div>
                <div className="bar">
                  <ProgressBar pct={st.pct} />
                </div>
                <div className="pct">{st.pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
