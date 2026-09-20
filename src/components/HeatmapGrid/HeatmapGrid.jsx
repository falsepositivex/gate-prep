import { ymdEpoch, isoFromEpoch } from '../../utils/ist.js';
import { utilClass } from '../../utils/stats.js';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function HeatmapGrid({ util, onCellClick }) {
  const yearStart = ymdEpoch(2026, 0, 1);
  const yearEnd   = ymdEpoch(2026, 11, 31);

  // Sunday on/before Jan 1 2026
  const startDow = new Date(yearStart).getUTCDay();
  const gridStart = yearStart - startDow * 86400000;

  // Build week array
  const weeks = [];
  let cursor = gridStart;
  while (cursor <= yearEnd) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(cursor);
      cursor += 86400000;
    }
    weeks.push(week);
  }

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
      <div key={wi} style={{ width: '16px', flexShrink: 0 }}>
        {label}
      </div>
    );
  });

  return (
    <div className="util-scroll">
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
                  const u = util[iso];
                  const titleStr = iso + (u
                    ? ` · studied ${u.studied || 0}h / wasted ${u.wasted || 0}h`
                    : ' · no data');
                  return (
                    <div
                      key={di}
                      className={`util-cell${cls ? ' ' + cls : ''}`}
                      title={titleStr}
                      data-date={iso}
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
  );
}
