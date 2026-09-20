import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion.jsx';
import ChipFilter from '../../components/ChipFilter/ChipFilter.jsx';
import { SYLLABUS } from '../../constants/syllabus.js';
import { topicStatus } from '../../utils/stats.js';

const FILTER_OPTIONS = [
  { value: 'all',        label: 'All' },
  { value: 'notstarted', label: 'Not started' },
  { value: 'inprogress', label: 'In progress' },
  { value: 'done',       label: 'Fully revised' },
  { value: 'weak',       label: 'Weak ★' },
];

export default function SyllabusView() {
  const { state } = useApp();
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const active = searchTerm || filterMode !== 'all';

  return (
    <div className="sheet">
      <h2 className="section-title">Syllabus Tracker</h2>
      <p className="section-note">
        Based on the official GATE 2027 CS/IT syllabus (IIT Madras). Click a stage tag to toggle it for that topic.
      </p>

      <div className="toolbar">
        <input
          type="search"
          id="topicSearch"
          placeholder="Search a topic or subject…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value.trim().toLowerCase())}
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
              if (searchTerm) {
                const hay = (subj.name + ' ' + t).toLowerCase();
                if (!hay.includes(searchTerm)) return false;
              }
              return true;
            });

          // If filtering/searching and no matching topics, hide subject
          if (active && matchingTopics.length === 0) return null;

          // Topics to actually render inside accordion
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
    </div>
  );
}
