// localStorage persistence — same key as the original HTML mock for seamless migration
export const STORE_KEY = "gate2027_tracker_v3";

const INITIAL_STATE = {
  topics: {},
  tests: [],
  logs: [],
  util: {},
  notes: {},
  mistakes: [],
  revisions: {}
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign({ ...INITIAL_STATE }, JSON.parse(raw));
  } catch (e) { /* ignore */ }
  return { ...INITIAL_STATE };
}

export function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}
