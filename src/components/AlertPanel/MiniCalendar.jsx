import { useState } from 'react';
import { istTodayParts, ymdToIso, ymdEpoch } from '../../utils/ist.js';
import { cdBucket } from '../../constants/urgency.js';
import { PREP_DEADLINE_YMD, CAL_MAX } from '../../constants/dates.js';

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

  const min = calMin();
  const atMin = viewYear === min.y && viewMonth === min.m;
  const atMax = viewYear === CAL_MAX.y && viewMonth === CAL_MAX.m;

  function prevMonth() {
    if (atMin) return;
    let m = viewMonth - 1, y = viewYear;
    if (m < 0) { m = 11; y--; }
    // clamp
    if (y < min.y || (y === min.y && m < min.m)) { setViewYear(min.y); setViewMonth(min.m); return; }
    setViewYear(y); setViewMonth(m);
  }

  function nextMonth() {
    if (atMax) return;
    let m = viewMonth + 1, y = viewYear;
    if (m > 11) { m = 0; y++; }
    // clamp
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
    cells.push(<div key={`e${i}`} className="alert-cal-cell empty" />);
  }
  // day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = ymdToIso(viewYear, viewMonth, d);
    const dayEpoch = ymdEpoch(viewYear, viewMonth, d);
    const diffToDeadline = Math.round((deadlineEpoch - dayEpoch) / 86400000);
    let cls = 'alert-cal-cell';
    if (iso < todayIso) {
      cls += ' past cd-safe';
    } else if (diffToDeadline < 0) {
      cls += ' cd-critical';
    } else {
      cls += ' ' + cdBucket(diffToDeadline);
    }
    if (iso === todayIso) cls += ' today';
    if (iso === deadlineIso) cls += ' deadline';
    cells.push(
      <div
        key={iso}
        className={cls}
        title={iso === deadlineIso ? 'Deadline day' : iso}
      >
        {d}
      </div>
    );
  }

  const title = `${MONTHS[viewMonth]} ${viewYear}`;

  return (
    <div className="alert-cal">
      <div className="alert-cal-nav">
        <button
          className="cal-nav-btn"
          onClick={prevMonth}
          disabled={atMin}
          aria-label="Previous month"
        >‹</button>
        <div className="alert-cal-title">{title}</div>
        <button
          className="cal-nav-btn"
          onClick={nextMonth}
          disabled={atMax}
          aria-label="Next month"
        >›</button>
      </div>
      <div className="alert-cal-grid">
        {DAY_LABELS.map((l, i) => (
          <div key={i} className="cd-daylabel">{l}</div>
        ))}
        {cells}
      </div>
      <div className="alert-cal-legend">
        <span className="sw cd-safe" />safe&nbsp;
        <span className="sw cd-warn" />watch&nbsp;
        <span className="sw cd-danger" />crunch&nbsp;
        <span className="sw cd-critical" />critical
      </div>
    </div>
  );
}
