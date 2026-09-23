import { saveState } from '../utils/storage.js';
import { getRevCount } from '../utils/stats.js';
import { istTodayIso } from '../utils/ist.js';

export function appReducer(state, action) {
  let newState;

  switch (action.type) {

    case 'TOGGLE_STAGE': {
      const { subjId, idx, stage } = action.payload;
      const key = subjId + "::" + idx;
      const existing = state.topics[key] || { L: false, D: false, P: false, R: false, weak: false };
      newState = {
        ...state,
        topics: {
          ...state.topics,
          [key]: { ...existing, [stage]: !existing[stage] }
        }
      };
      break;
    }

    case 'TOGGLE_WEAK': {
      const { subjId, idx } = action.payload;
      const key = subjId + "::" + idx;
      const existing = state.topics[key] || { L: false, D: false, P: false, R: false, weak: false };
      newState = {
        ...state,
        topics: {
          ...state.topics,
          [key]: { ...existing, weak: !existing.weak }
        }
      };
      break;
    }

    case 'INC_REVISION': {
      const { subjId } = action.payload;
      const current = getRevCount(state.revisions, subjId);
      newState = {
        ...state,
        revisions: { ...state.revisions, [subjId]: current + 1 }
      };
      break;
    }

    case 'DEC_REVISION': {
      const { subjId } = action.payload;
      const current = getRevCount(state.revisions, subjId);
      newState = {
        ...state,
        revisions: { ...state.revisions, [subjId]: Math.max(0, current - 1) }
      };
      break;
    }

    case 'UPDATE_NOTE': {
      const { subjId, text } = action.payload;
      newState = {
        ...state,
        notes: { ...state.notes, [subjId]: text }
      };
      break;
    }

    case 'ADD_TEST': {
      const { date, name, score, max, testType } = action.payload;
      newState = {
        ...state,
        tests: [...state.tests, { id: Date.now(), date: date || istTodayIso(), name, score, max, type: testType }]
      };
      break;
    }

    case 'DELETE_TEST': {
      newState = {
        ...state,
        tests: state.tests.filter(t => String(t.id) !== String(action.payload.id))
      };
      break;
    }

    case 'ADD_LOG': {
      const { date, hours, subject, note } = action.payload;
      newState = {
        ...state,
        logs: [...state.logs, { id: Date.now(), date: date || istTodayIso(), hours, subject, note }]
      };
      break;
    }

    case 'DELETE_LOG': {
      newState = {
        ...state,
        logs: state.logs.filter(l => String(l.id) !== String(action.payload.id))
      };
      break;
    }

    case 'SET_UTIL_DAY': {
      const { iso, studied, wasted } = action.payload;
      newState = {
        ...state,
        util: { ...state.util, [iso]: { studied, wasted } }
      };
      break;
    }

    case 'CLEAR_UTIL_DAY': {
      const { iso } = action.payload;
      const nextUtil = { ...state.util };
      delete nextUtil[iso];
      newState = { ...state, util: nextUtil };
      break;
    }

    case 'ADD_MISTAKE': {
      const { date, subject, source, mistake, fix } = action.payload;
      newState = {
        ...state,
        mistakes: [
          ...state.mistakes,
          { id: Date.now(), date: date || istTodayIso(), subject, source, mistake, fix, resolved: false }
        ]
      };
      break;
    }

    case 'TOGGLE_MISTAKE': {
      newState = {
        ...state,
        mistakes: state.mistakes.map(m =>
          String(m.id) === String(action.payload.id) ? { ...m, resolved: !m.resolved } : m
        )
      };
      break;
    }

    case 'DELETE_MISTAKE': {
      newState = {
        ...state,
        mistakes: state.mistakes.filter(m => String(m.id) !== String(action.payload.id))
      };
      break;
    }

    case 'SET_LECTURE_COUNT': {
      const { subjId, total } = action.payload;
      const existing = state.lectures[subjId] || { total: 0, completed: {} };
      newState = {
        ...state,
        lectures: {
          ...state.lectures,
          [subjId]: { ...existing, total: Math.max(0, total) }
        }
      };
      break;
    }

    case 'TOGGLE_LECTURE': {
      const { subjId, lecNum } = action.payload;
      const existing = state.lectures[subjId] || { total: 0, completed: {} };
      const nextCompleted = { ...existing.completed };
      if (nextCompleted[lecNum]) {
        delete nextCompleted[lecNum];
      } else {
        // Record IST timestamp when marking complete
        nextCompleted[lecNum] = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      }
      newState = {
        ...state,
        lectures: {
          ...state.lectures,
          [subjId]: { ...existing, completed: nextCompleted }
        }
      };
      break;
    }

    case 'COMPLETE_ALL_LECTURES': {
      const { subjId } = action.payload;
      const existing = state.lectures[subjId] || { total: 0, completed: {} };
      const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const nextCompleted = { ...existing.completed };
      for (let i = 1; i <= existing.total; i++) {
        if (!nextCompleted[i]) nextCompleted[i] = now;
      }
      newState = {
        ...state,
        lectures: {
          ...state.lectures,
          [subjId]: { ...existing, completed: nextCompleted }
        }
      };
      break;
    }

    case 'RESET_ALL_LECTURES': {
      const { subjId } = action.payload;
      const existing = state.lectures[subjId] || { total: 0, completed: {} };
      newState = {
        ...state,
        lectures: {
          ...state.lectures,
          [subjId]: { ...existing, completed: {} }
        }
      };
      break;
    }

    case 'CLEAR_LECTURES': {
      const { subjId } = action.payload;
      const nextLectures = { ...state.lectures };
      delete nextLectures[subjId];
      newState = { ...state, lectures: nextLectures };
      break;
    }

    case 'IMPORT_STATE': {
      newState = action.payload.newState;
      break;
    }

    default:
      return state;
  }

  saveState(newState);
  return newState;
}
