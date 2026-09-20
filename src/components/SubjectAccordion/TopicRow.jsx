import { useApp } from '../../context/AppContext.jsx';
import { STAGES } from '../../constants/syllabus.js';

export default function TopicRow({ subjId, topicName, idx }) {
  const { state, dispatch } = useApp();
  const key = subjId + '::' + idx;
  const ts = state.topics[key] || { L: false, D: false, P: false, R: false, weak: false };

  function toggleStage(stage) {
    dispatch({ type: 'TOGGLE_STAGE', payload: { subjId, idx, stage } });
  }

  function toggleWeak(e) {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_WEAK', payload: { subjId, idx } });
  }

  return (
    <div className="topic-row">
      <div className="topic-name">
        {topicName}
        <span
          className="star"
          data-subj={subjId}
          data-idx={idx}
          title="Flag as weak topic"
          onClick={toggleWeak}
          style={{ cursor: 'pointer' }}
        >
          {ts.weak ? '★' : '☆'}
        </span>
      </div>
      <div className="stage-group">
        {STAGES.map(s => (
          <button
            key={s.k}
            className={`stage-btn${ts[s.k] ? ' on ' + s.k : ''}`}
            onClick={(e) => { e.preventDefault(); toggleStage(s.k); }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
