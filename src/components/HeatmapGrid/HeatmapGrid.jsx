import { useEffect, useRef, useState } from 'react';
import { ymdEpoch, isoFromEpoch, istTodayIso } from '../../utils/ist.js';
import { utilClass } from '../../utils/stats.js';
import { cn } from '../../lib/utils';
import { Target } from 'lucide-react';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function HeatmapGrid({ util, onCellClick, activeDate }) {
  const yearStart = ymdEpoch(2026, 0, 1);
  const yearEnd   = ymdEpoch(2026, 11, 31);
  const todayIso  = istTodayIso();
  const scrollRef = useRef(null);

  // Sunday on/before Jan 1 2026
  const startDow = new Date(yearStart).getUTCDay();
  const gridStart = yearStart - startDow * 86400000;

  // Build week array
  const weeks = [];
  let cursor = gridStart;
  let todayWeekIndex = 0;
  while (cursor <= yearEnd) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(cursor);
      if (isoFromEpoch(cursor) === todayIso) {
        todayWeekIndex = weeks.length;
      }
      cursor += 86400000;
    }
    weeks.push(week);
  }

  function scrollToToday() {
    if (scrollRef.current && todayWeekIndex > 0) {
      // cellWidth + gap = 16 + 4 = 20px
      const offset = (todayWeekIndex * 20) - 100;
      scrollRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    }
  }

  useEffect(() => {
    scrollToToday();
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Month label row
  let lastMonth = -1;
  const monthLabels = weeks.map((week, wi) => {
    const dt = new Date(week[0]);
    const m = dt.getUTCMonth();
    let label = '';
    if (week[0] >= yearStart && m !== lastMonth) {
      label = MONTHS_SHORT[m];
      lastMonth = m;
    }
    return (
      <div key={wi} className="w-[20px] shrink-0 font-mono text-[10px] text-text-muted">
        {label}
      </div>
    );
  });
  
  // Tailwind color classes mapping for utilClass
  const utilColorClasses = {
    'u-r4': 'bg-[#6b2e26]',
    'u-r3': 'bg-[#7a342b]',
    'u-r2': 'bg-[#893a30]',
    'u-r1': 'bg-[#943f30]',
    'u-g1': 'bg-[#295934]',
    'u-g2': 'bg-[#2e643a]',
    'u-g3': 'bg-[#336f40]',
    'u-g4': 'bg-[#387a46]'
  };

  return (
    <div className="glass-card p-4 sm:p-6 mb-8 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-text-muted">
          <span>Less productive</span>
          <div className="flex gap-[3px] mx-1">
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#6b2e26]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#7a342b]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#893a30]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#943f30]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-surface-3" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#295934]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#2e643a]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#336f40]" />
            <span className="w-3.5 h-3.5 rounded-[3px] bg-[#387a46]" />
          </div>
          <span>More productive</span>
        </div>
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] font-semibold text-accent border border-accent/30 hover:bg-accent/10 transition-colors shrink-0"
          onClick={scrollToToday}
        >
          <Target className="w-3.5 h-3.5" /> Today
        </button>
      </div>

      <div 
        className={cn(
          "w-full overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-surface-3 scrollbar-track-transparent",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex flex-col min-w-max">
          <div className="flex ml-[30px] mb-1.5">{monthLabels}</div>
          
          <div className="flex">
            <div className="flex flex-col gap-[4px] mr-2 w-[22px] shrink-0 font-mono text-[9px] text-text-muted mt-0.5 leading-[16px]">
              {DAY_LABELS.map((l, i) => <div key={i} className="h-[16px] flex items-center justify-end pr-1">{l}</div>)}
            </div>
            
            <div className="flex gap-[4px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[4px]">
                  {week.map((dayEpoch, di) => {
                    if (dayEpoch < yearStart || dayEpoch > yearEnd) {
                      return <div key={di} className="w-[16px] h-[16px]" />;
                    }
                    const iso = isoFromEpoch(dayEpoch);
                    const cls = utilClass(util, iso);
                    const isToday = iso === todayIso;
                    const isActive = iso === activeDate;
                    const u = util[iso];
                    
                    const titleStr = iso + (u
                      ? ` · studied ${u.studied || 0}h / wasted ${u.wasted || 0}h`
                      : ' · no data');
                    
                    const bgColor = cls ? utilColorClasses[cls] : 'bg-surface-3/50 hover:bg-surface-3';

                    return (
                      <div
                        key={di}
                        title={titleStr}
                        onClick={() => onCellClick(iso)}
                        className={cn(
                          "w-[16px] h-[16px] rounded-[3px] cursor-pointer transition-all duration-200",
                          bgColor,
                          isToday && "ring-1 ring-white ring-offset-2 ring-offset-surface-1",
                          isActive && !isToday && "ring-1 ring-accent ring-offset-2 ring-offset-surface-1",
                          isActive && "scale-110 shadow-[0_0_10px_rgba(235,164,58,0.4)] z-10",
                          !isActive && "hover:scale-[1.15] hover:z-10 hover:shadow-lg"
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
