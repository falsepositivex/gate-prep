// localStorage persistence — same key as the original HTML mock for seamless migration
export const STORE_KEY = "gate2027_tracker_v3";

const INITIAL_STATE = {
  topics: {},
  tests: [],
  logs: [],
  util: {},
  notes: {},
  mistakes: [],
  revisions: {},
  lectures: {}
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = Object.assign({ ...INITIAL_STATE }, JSON.parse(raw));
      // Migration: set startFrom=1 and convert legacy 1-based completed keys to 0-based internal keys
      if (parsed.lectures) {
        Object.keys(parsed.lectures).forEach(subjId => {
          if (parsed.lectures[subjId].startFrom === undefined) {
            parsed.lectures[subjId].startFrom = 1;
            // Shift existing 1-based completed keys to 0-based internal keys
            if (parsed.lectures[subjId].completed) {
              const oldCompleted = parsed.lectures[subjId].completed;
              const newCompleted = {};
              for (const [k, v] of Object.entries(oldCompleted)) {
                newCompleted[Number(k) - 1] = v;
              }
              parsed.lectures[subjId].completed = newCompleted;
            }
          }
        });
      }
      return parsed;
    }
  } catch (e) { /* ignore */ }
  return { ...INITIAL_STATE };
}

export function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}
