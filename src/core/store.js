const state = {};
const listeners = new Map();

export function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return () => listeners.get(key).delete(fn);
}

export function set(key, value) {
  state[key] = value;
  if (listeners.has(key)) {
    for (const fn of listeners.get(key)) fn(value);
  }
}

export function get(key) {
  return state[key];
}
