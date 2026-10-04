import { useApp } from '../../context/AppContext.jsx';
import { STAGES } from '../../constants/syllabus.js';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

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

  // Stage button colors based on stage key
  const stageColors = {
    L: "data-[state=on]:bg-[#5f8fc4]/10 data-[state=on]:text-[#5f8fc4] data-[state=on]:border-[#5f8fc4]/40 data-[state=on]:shadow-[0_0_8px_rgba(95,143,196,0.15)]",
    D: "data-[state=on]:bg-[#8fae5f]/10 data-[state=on]:text-[#8fae5f] data-[state=on]:border-[#8fae5f]/40 data-[state=on]:shadow-[0_0_8px_rgba(143,174,95,0.15)]",
    P: "data-[state=on]:bg-accent/10 data-[state=on]:text-accent data-[state=on]:border-accent/40 data-[state=on]:shadow-[0_0_8px_rgba(235,164,58,0.15)]",
    R: "data-[state=on]:bg-purple/10 data-[state=on]:text-purple data-[state=on]:border-purple/40 data-[state=on]:shadow-[0_0_8px_rgba(160,134,201,0.15)]",
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3.5 group">
      <div className="flex items-start gap-2 text-[15px] leading-relaxed md:max-w-[55%] text-text-main group-hover:text-white transition-colors">
        <span className="flex-1">{topicName}</span>
        <button
          onClick={toggleWeak}
          title={ts.weak ? "Remove weak flag" : "Flag as weak topic"}
          className={cn(
            "p-1.5 -m-1.5 rounded hover:bg-surface-3 transition-colors focus:outline-none shrink-0 mt-0.5",
            ts.weak ? "text-accent" : "text-text-muted hover:text-accent/70"
          )}
        >
          <Star className={cn("w-4 h-4 transition-all duration-300", ts.weak && "fill-accent scale-110")} />
        </button>
      </div>
      
      <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
        {STAGES.map(s => (
          <button
            key={s.k}
            data-state={ts[s.k] ? 'on' : 'off'}
            className={cn(
              "px-3 py-1.5 rounded-md font-mono text-[11px] font-semibold tracking-wider border transition-all duration-200 uppercase whitespace-nowrap focus:outline-none",
              ts[s.k]
                ? stageColors[s.k]
                : "bg-surface-2 border-border-strong text-text-muted hover:bg-surface-3 hover:text-white"
            )}
            onClick={(e) => { e.preventDefault(); toggleStage(s.k); }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
