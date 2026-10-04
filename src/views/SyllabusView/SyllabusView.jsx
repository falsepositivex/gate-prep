import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion.jsx';
import LectureTracker from '../../components/SubjectAccordion/LectureTracker.jsx';
import ChipFilter from '../../components/ChipFilter/ChipFilter.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { topicStatus, lectureStats, overallLectureStats } from '../../utils/stats.js';

const FILTER_OPTIONS = [
  { value: 'all',        label: 'All' },
  { value: 'notstarted', label: 'Not started' },
  { value: 'inprogress', label: 'In progress' },
  { value: 'done',       label: 'Fully revised' },
  { value: 'weak',       label: 'Weak ★' },
];

const INNER_TABS = [
  { id: 'syllabus',  label: 'Syllabus',  icon: '📋' },
  { id: 'lectures',  label: 'Lectures',  icon: '🎥' },
];

// ─── Syllabus Sub-View ───────────────────────────────────────────────────────
function SyllabusTracker() {
  const { state } = useApp();
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const active = searchTerm.trim() || filterMode !== 'all';

  return (
    <>
      <p className="section-note">
        Based on the official GATE 2027 CS/IT syllabus (IIT Madras). Click a stage tag to toggle it for that topic.
      </p>

      <div className="toolbar">
        <input
          type="search"
          id="topicSearch"
          placeholder="Search a topic or subject…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <ChipFilter options={FILTER_OPTIONS} active={filterMode} onChange={setFilterMode} />
      </div>

      <div id="subjectList">
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
    </>
  );
}

// ─── Lectures Sub-View ───────────────────────────────────────────────────────
function LecturesOverview() {
  const { state } = useApp();
  const lecOverall = overallLectureStats(state.lectures);

  return (
    <>
      <p className="section-note">
        Track your lecture progress subject-by-subject. Set the total count, then check off each lecture as you watch it.
      </p>

      {lecOverall.total > 0 && (
        <div className="lec-overall-banner">
          <div className="lec-overall-left">
            <div className="lec-overall-label">Overall lectures</div>
            <div className="lec-overall-count">
              <span className="lec-overall-done">{lecOverall.completed}</span>
              <span className="lec-overall-sep">/</span>
              <span className="lec-overall-total">{lecOverall.total}</span>
            </div>
          </div>
          <div className="lec-overall-right">
            <div className="lec-overall-pct">{lecOverall.pct}%</div>
            <div className="lec-overall-meta">{lecOverall.subjects} subject{lecOverall.subjects !== 1 ? 's' : ''} tracked</div>
          </div>
          <div className="lec-overall-bar-wrap">
            <div className="lec-overall-bar">
              <div className="lec-overall-fill" style={{ width: `${lecOverall.pct}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="lec-subject-grid">
        {SYLLABUS.map(subj => {
          const stats = lectureStats(state.lectures, subj.id);
          return (
            <div key={subj.id} className="lec-subject-card">
              <div className="lec-subject-card-header">
                <span className="lec-subject-card-name">{subj.name}</span>
                {stats.total > 0 && (
                  <span className="lec-subject-card-badge">
                    {stats.completed}/{stats.total} · {stats.pct}%
                  </span>
                )}
              </div>
              <LectureTracker subjId={subj.id} cardMode />
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Main View ───────────────────────────────────────────────────────────────
export default function SyllabusView() {
  const [innerTab, setInnerTab] = useState('syllabus');

  return (
    <div className="sheet">
      <h2 className="section-title">Syllabus Tracker</h2>

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
        {innerTab === 'syllabus'  && <SyllabusTracker />}
        {innerTab === 'lectures'  && <LecturesOverview />}
      </div>
    </div>
  );
}
