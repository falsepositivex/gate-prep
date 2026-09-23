import { useEffect, useRef } from 'react';
import { ymdEpoch, isoFromEpoch, istTodayIso } from '../../utils/ist.js';
import { utilClass } from '../../utils/stats.js';

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
      // cellWidth + gap = 14 + 4 = 18px (based on updated CSS sizes)
      // We center it roughly by subtracting a bit from the total scroll
      const offset = (todayWeekIndex * 18) - 100;
      scrollRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    }
  }

  useEffect(() => {
    scrollToToday();
  }, []);

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
      <div key={wi} style={{ width: '18px', flexShrink: 0 }}>
        {label}
      </div>
    );
  });

  return (
    <div className="util-heatmap-container">
      <div className="util-heatmap-header">
        <div className="util-legend">
          <span>Less productive</span>
          <span className="sw u-r4" /><span className="sw u-r3" /><span className="sw u-r2" /><span className="sw u-r1" />
          <span className="sw" style={{ background: 'var(--bg-3)' }} />
          <span className="sw u-g1" /><span className="sw u-g2" /><span className="sw u-g3" /><span className="sw u-g4" />
          <span>More productive</span>
        </div>
        <button className="util-jump-btn" onClick={scrollToToday}>Today →</button>
      </div>

      <div className="util-scroll" ref={scrollRef}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Month labels */}
          <div className="util-months">{monthLabels}</div>
          {/* Grid */}
          <div className="util-grid-wrap">
            {/* Day-of-week labels */}
            <div className="util-daylabels">
              {DAY_LABELS.map((l, i) => <div key={i}>{l}</div>)}
            </div>
            {/* Weeks */}
            <div className="util-weeks">
              {weeks.map((week, wi) => (
                <div key={wi} className="util-week">
                  {week.map((dayEpoch, di) => {
                    if (dayEpoch < yearStart || dayEpoch > yearEnd) {
                      return <div key={di} className="util-cell empty" />;
                    }
                    const iso = isoFromEpoch(dayEpoch);
                    const cls = utilClass(util, iso);
                    const isToday = iso === todayIso;
                    const isActive = iso === activeDate;
                    const u = util[iso];
                    const titleStr = iso + (u
                      ? ` · studied ${u.studied || 0}h / wasted ${u.wasted || 0}h`
                      : ' · no data');
                    
                    let finalClass = 'util-cell';
                    if (cls) finalClass += ` ${cls}`;
                    if (isToday) finalClass += ' today';
                    if (isActive) finalClass += ' active';

                    return (
                      <div
                        key={di}
                        className={finalClass}
                        title={titleStr}
                        onClick={() => onCellClick(iso)}
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
