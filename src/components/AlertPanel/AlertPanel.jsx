import MiniCalendar from './MiniCalendar.jsx';
import { istTodayParts, ymdEpoch } from '../../utils/ist.js';
import { PREP_DEADLINE_YMD, PREP_STARTED_YMD } from '../../constants/dates.js';
import { urgencyLevel, URGENCY_MSG } from '../../constants/urgency.js';

export default function AlertPanel() {
  const todayT = istTodayParts();
  const todayEpoch = ymdEpoch(todayT.y, todayT.m, todayT.d);
  const deadlineEpoch = ymdEpoch(PREP_DEADLINE_YMD.y, PREP_DEADLINE_YMD.m, PREP_DEADLINE_YMD.d);
  const diff = Math.round((deadlineEpoch - todayEpoch) / 86400000);
  const lvl = diff <= 0 ? 'critical' : urgencyLevel(diff);

  const startEpoch = ymdEpoch(PREP_STARTED_YMD.y, PREP_STARTED_YMD.m, PREP_STARTED_YMD.d);
  const totalSpan = Math.max(1, Math.round((deadlineEpoch - startEpoch) / 86400000));
  const elapsed = Math.min(totalSpan, Math.max(0, Math.round((todayEpoch - startEpoch) / 86400000)));
  const elapsedPct = Math.round((elapsed / totalSpan) * 100);

  const meterGradient =
    lvl === 'safe'   ? 'linear-gradient(90deg,var(--green-deep),var(--green))' :
    lvl === 'watch'  ? 'linear-gradient(90deg,var(--amber-deep),var(--amber))' :
                        'linear-gradient(90deg,var(--red-deep),var(--red))';

  const alertMsg = diff > 0 ? URGENCY_MSG[lvl] : 'Deadline reached — full shift to revision & mock tests now.';
  const daysDisplay = diff > 0 ? diff : 0;

  return (
    <div className={`alert-panel lvl-${lvl}`} id="alertPanel">
      <div className="alert-left">
        <div className="alert-kicker">⏱ SYLLABUS DEADLINE · 31 DEC 2026</div>
        <div className="alert-num" id="alertDays">{daysDisplay}</div>
        <div className="alert-unit">DAYS LEFT TO FINISH SYLLABUS</div>
        <div className="alert-msg" id="alertMsg">{alertMsg}</div>
        <div className="alert-meter">
          <div
            className="alert-meter-inner"
            id="alertMeter"
            style={{ width: elapsedPct + '%', background: meterGradient }}
          />
        </div>
        <div className="alert-sub" id="alertSub">
          {elapsedPct}% of your planned prep window is behind you.
        </div>
      </div>
      <MiniCalendar />
    </div>
  );
}
