import MiniCalendar from './MiniCalendar.jsx';
import { istTodayParts, ymdEpoch } from '../../utils/ist.js';
import { PREP_DEADLINE_YMD, PREP_STARTED_YMD } from '../../constants/dates.js';
import { urgencyLevel, URGENCY_MSG } from '../../constants/urgency.js';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const lvlStyles = {
    safe: "border-green/50 shadow-[0_0_20px_rgba(74,222,128,0.1)]",
    watch: "border-accent/50 shadow-[0_0_30px_rgba(235,164,58,0.15)]",
    crunch: "border-red/50 shadow-[0_0_30px_rgba(248,113,113,0.2)]",
    critical: "border-red bg-[#2a1815] shadow-[0_0_40px_rgba(248,113,113,0.3)]",
  };

  const textStyles = {
    safe: "text-green",
    watch: "text-accent",
    crunch: "text-red",
    critical: "text-red",
  };

  const meterGradient =
    lvl === 'safe'   ? 'bg-gradient-to-r from-green-deep to-green' :
    lvl === 'watch'  ? 'bg-gradient-to-r from-accent-deep to-accent' :
                       'bg-gradient-to-r from-red-deep to-red';

  const alertMsg = diff > 0 ? URGENCY_MSG[lvl] : 'Deadline reached — full shift to revision & mock tests now.';
  const daysDisplay = diff > 0 ? diff : 0;

  return (
    <div className={`flex flex-col lg:flex-row gap-5 sm:gap-8 items-start bg-surface-1 border-2 rounded-2xl p-4 sm:p-6 sm:p-8 mb-5 sm:mb-6 transition-all duration-500 relative overflow-hidden ${lvlStyles[lvl]}`}>
      {/* Background glow behind the text */}
      <div className={`absolute top-0 left-0 w-64 h-64 blur-[80px] rounded-full opacity-10 pointer-events-none ${lvl === 'safe' ? 'bg-green' : lvl === 'watch' ? 'bg-accent' : 'bg-red'}`} />
      
      <div className="flex-1 relative z-10 w-full">
        <div className="font-mono text-xs tracking-[0.1em] text-cyan uppercase mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Syllabus Deadline · 31 Dec 2026
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            className={`font-head font-bold text-6xl sm:text-7xl md:text-[6rem] leading-none tracking-tighter ${textStyles[lvl]}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          >
            {daysDisplay}
          </motion.div>
          <div className="font-mono text-sm tracking-widest text-text-muted uppercase leading-tight">
            Days left to finish syllabus
          </div>
        </div>
        
        <div className="font-head text-xl font-semibold text-white mt-4 mb-6">
          {alertMsg}
        </div>
        
        <div className="w-full max-w-[340px] h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className={`h-full rounded-full ${meterGradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${elapsedPct}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        
        <div className="font-mono text-[13px] text-text-muted">
          {elapsedPct}% of your planned prep window is behind you.
        </div>
      </div>
      
      <div className="w-full lg:w-auto flex-shrink-0 relative z-10 flex justify-center lg:justify-start min-w-[260px]">
        <MiniCalendar />
      </div>
    </div>
  );
}
