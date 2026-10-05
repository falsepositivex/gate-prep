import { useState } from 'react';
import { istTodayParts, ymdToIso, ymdEpoch } from '../../utils/ist.js';
import { cdBucket } from '../../constants/urgency.js';
import { PREP_DEADLINE_YMD, CAL_MAX } from '../../constants/dates.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function calMin() {
  const t = istTodayParts();
  return { y: t.y, m: t.m };
}

export default function MiniCalendar() {
  const init = calMin();
  const [viewYear, setViewYear] = useState(init.y);
  const [viewMonth, setViewMonth] = useState(init.m);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const min = calMin();
  const atMin = viewYear === min.y && viewMonth === min.m;
  const atMax = viewYear === CAL_MAX.y && viewMonth === CAL_MAX.m;

  function prevMonth() {
    if (atMin) return;
    setDirection(-1);
    let m = viewMonth - 1, y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (y < min.y || (y === min.y && m < min.m)) { setViewYear(min.y); setViewMonth(min.m); return; }
    setViewYear(y); setViewMonth(m);
  }

  function nextMonth() {
    if (atMax) return;
    setDirection(1);
    let m = viewMonth + 1, y = viewYear;
    if (m > 11) { m = 0; y++; }
    if (y > CAL_MAX.y || (y === CAL_MAX.y && m > CAL_MAX.m)) { setViewYear(CAL_MAX.y); setViewMonth(CAL_MAX.m); return; }
    setViewYear(y); setViewMonth(m);
  }

  const todayT = istTodayParts();
  const todayIso = ymdToIso(todayT.y, todayT.m, todayT.d);
  const deadlineIso = ymdToIso(PREP_DEADLINE_YMD.y, PREP_DEADLINE_YMD.m, PREP_DEADLINE_YMD.d);
  const deadlineEpoch = ymdEpoch(PREP_DEADLINE_YMD.y, PREP_DEADLINE_YMD.m, PREP_DEADLINE_YMD.d);

  const startOffset = new Date(ymdEpoch(viewYear, viewMonth, 1)).getUTCDay();
  const daysInMonth = new Date(ymdEpoch(viewYear, viewMonth + 1, 0)).getUTCDate();

  const cells = [];
  // empty cells
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`e${i}`} className="w-full aspect-square" />);
  }
  // day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = ymdToIso(viewYear, viewMonth, d);
    const dayEpoch = ymdEpoch(viewYear, viewMonth, d);
    const diffToDeadline = Math.round((deadlineEpoch - dayEpoch) / 86400000);
    
    let bucket = cdBucket(diffToDeadline);
    if (diffToDeadline < 0) bucket = 'cd-critical';
    
    const isPast = iso < todayIso;
    const isToday = iso === todayIso;
    const isDeadline = iso === deadlineIso;
    
    const bgColors = {
      'cd-safe': 'bg-[#234a2c]',
      'cd-warn': 'bg-[#5a4a1f]',
      'cd-danger': 'bg-[#6b2e26]',
      'cd-critical': 'bg-[#943f30]',
    };

    cells.push(
      <div
        key={iso}
        title={isDeadline ? 'Deadline day' : iso}
        className={cn(
          "w-full aspect-square rounded-[4px] flex items-center justify-center font-mono text-[11px] sm:text-xs relative transition-transform hover:scale-110 cursor-default",
          bgColors[bucket] || "bg-surface-3",
          isPast ? "opacity-30" : "text-white/90",
          isToday ? "ring-2 ring-white ring-offset-1 ring-offset-surface-1 font-bold z-10" : "",
          isDeadline ? "ring-2 ring-red ring-offset-1 ring-offset-surface-1 font-bold z-10 text-white" : ""
        )}
      >
        {isDeadline && (
          <div className="absolute -top-3 text-[10px] text-red font-bold">▾</div>
        )}
        {d}
      </div>
    );
  }

  const title = `${MONTHS[viewMonth]} ${viewYear}`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          className="w-7 h-7 rounded-md border border-border-strong bg-surface-3 text-text-main flex items-center justify-center hover:bg-surface-2 hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:hover:bg-surface-3 disabled:hover:border-border-strong disabled:hover:text-text-main disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={prevMonth}
          disabled={atMin}
          aria-label="Previous month"
        ><ChevronLeft className="w-4 h-4" /></button>
        <div className="font-mono text-xs uppercase tracking-wider text-text-muted text-center flex-1 font-semibold">{title}</div>
        <button
          className="w-7 h-7 rounded-md border border-border-strong bg-surface-3 text-text-main flex items-center justify-center hover:bg-surface-2 hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:hover:bg-surface-3 disabled:hover:border-border-strong disabled:hover:text-text-main disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={nextMonth}
          disabled={atMax}
          aria-label="Next month"
        ><ChevronRight className="w-4 h-4" /></button>
      </div>
      
      <div className="w-full relative min-h-[190px] p-1 -mx-1 overflow-visible">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map((l, i) => (
            <div key={i} className="font-mono text-[10px] text-text-muted text-center pb-1 font-semibold">{l}</div>
          ))}
        </div>
        
        <AnimatePresence mode="wait" initial={false}>
          <motion.div 
            key={`${viewYear}-${viewMonth}`}
            className="grid grid-cols-7 gap-[3px] sm:gap-1 w-full"
            initial={{ x: direction * 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 20, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            {cells}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex items-center justify-center gap-3 sm:gap-4 font-mono text-[10px] sm:text-[11px] text-text-muted mt-2 flex-wrap">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#234a2c]" /> safe</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#5a4a1f]" /> watch</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#6b2e26]" /> crunch</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[2px] bg-[#943f30]" /> critical</div>
      </div>
    </div>
  );
}
