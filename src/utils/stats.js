import { SYLLABUS, STAGES } from '../constants/syllabus.js';
import { isoDaysAgo } from './ist.js';

// Compute aggregate stats for a single subject given its topics state map
export function subjectStats(subj, topicsState) {
  let total = subj.topics.length * STAGES.length;
  let done = 0, revised = 0, weak = 0;
  subj.topics.forEach((_, idx) => {
    const key = subj.id + "::" + idx;
    const ts = topicsState[key] || { L: false, D: false, P: false, R: false, weak: false };
    STAGES.forEach(s => { if (ts[s.k]) done++; });
    if (ts.R) revised++;
    if (ts.weak) weak++;
  });
  return {
    total,
    done,
    pct: total ? Math.round(done / total * 100) : 0,
    revised,
    weak,
    topicCount: subj.topics.length
  };
}

// Classify a topic's progress state
export function topicStatus(ts) {
  const anyOn = ts.L || ts.D || ts.P || ts.R;
  if (ts.R) return "done";
  if (anyOn) return "inprogress";
  return "notstarted";
}

// Count consecutive days with a study log entry, starting from today (IST)
export function computeStreak(logs) {
  if (!logs.length) return 0;
  const days = new Set(logs.map(l => l.date));
  let streak = 0;
  for (let i = 0; ; i++) {
    const iso = isoDaysAgo(i);
    if (days.has(iso)) streak++;
    else break;
  }
  return streak;
}

// Net hours (studied - wasted) over last 7 IST days from utilization data
export function last7NetHours(util) {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const iso = isoDaysAgo(i);
    const u = util[iso];
    if (u) total += (parseFloat(u.studied) || 0) - (parseFloat(u.wasted) || 0);
  }
  return total;
}

// Normalise revisions[subjId] — migrates old {count,last} object format
export function getRevCount(revisions, subjId) {
  const v = revisions[subjId];
  if (typeof v === "number" && !isNaN(v)) return v;
  if (v && typeof v === "object" && typeof v.count === "number") return v.count;
  return 0;
}

// Colour class for utilization heatmap cell based on net hours
export function utilClass(util, iso) {
  const u = util[iso];
  if (!u) return "";
  const studied = parseFloat(u.studied) || 0;
  const wasted  = parseFloat(u.wasted) || 0;
  if (studied === 0 && wasted === 0) return "";
  const net = studied - wasted;
  if (net > 6) return "u-g4";
  if (net > 4) return "u-g3";
  if (net > 1.5) return "u-g2";
  if (net > 0) return "u-g1";
  if (net === 0) return "u-neu";
  if (net > -2) return "u-r1";
  if (net > -4) return "u-r2";
  if (net > -6) return "u-r3";
  return "u-r4";
}

// Lecture progress stats for a single subject
export function lectureStats(lectures, subjId) {
  const data = lectures[subjId];
  if (!data || !data.total) return { total: 0, completed: 0, pct: 0 };
  const completed = Object.keys(data.completed).filter(
    k => parseInt(k) <= data.total
  ).length;
  return {
    total: data.total,
    completed,
    pct: data.total ? Math.round(completed / data.total * 100) : 0
  };
}

// Overall lecture progress across all subjects
export function overallLectureStats(lectures) {
  let totalLecs = 0, completedLecs = 0, subjectsWithLectures = 0;
  for (const subjId of Object.keys(lectures)) {
    const st = lectureStats(lectures, subjId);
    if (st.total > 0) {
      totalLecs += st.total;
      completedLecs += st.completed;
      subjectsWithLectures++;
    }
  }
  return {
    total: totalLecs,
    completed: completedLecs,
    pct: totalLecs ? Math.round(completedLecs / totalLecs * 100) : 0,
    subjects: subjectsWithLectures
  };
}
