// IST-anchored date helpers
// All "today" and day-boundary logic uses India Standard Time (UTC+5:30),
// not the device timezone. Calendar day math runs on UTC epochs.

export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function pad2(n) { return String(n).padStart(2, "0"); }

export function istTodayParts() {
  const shifted = new Date(Date.now() + IST_OFFSET_MS);
  return { y: shifted.getUTCFullYear(), m: shifted.getUTCMonth(), d: shifted.getUTCDate() };
}

// m is 0-indexed (matches Date.getMonth())
export function ymdToIso(y, m, d) {
  return y + "-" + pad2(m + 1) + "-" + pad2(d);
}

export function ymdEpoch(y, m, d) {
  return Date.UTC(y, m, d);
}

export function isoFromEpoch(epoch) {
  const dt = new Date(epoch);
  return ymdToIso(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
}

export function istTodayIso() {
  const t = istTodayParts();
  return ymdToIso(t.y, t.m, t.d);
}

export function isoDaysAgo(n) {
  const t = istTodayParts();
  return isoFromEpoch(ymdEpoch(t.y, t.m, t.d) - n * 86400000);
}
