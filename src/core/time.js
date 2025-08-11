import { get, set } from './store.js';

let running = false;
let lastReal = 0;
let msPerHour = Infinity;

function tick(realNow) {
  if (!running) return;
  const elapsed = realNow - lastReal;
  if (elapsed >= msPerHour) {
    const clock = get('clock');
    const next = new Date(clock.now.getTime() + 60 * 60 * 1000);
    set('clock', { now: next, speed: clock.speed });
    lastReal = realNow;
  }
  requestAnimationFrame(tick);
}

function startLoop() {
  if (!running) {
    running = true;
    lastReal = performance.now();
    requestAnimationFrame(tick);
  }
}

function stopLoop() {
  running = false;
}

export function playNormal() {
  msPerHour = 2500;
  const clock = get('clock');
  set('clock', { ...clock, speed: 'normal' });
  startLoop();
}

export function playFast() {
  msPerHour = 1000;
  const clock = get('clock');
  set('clock', { ...clock, speed: 'fast' });
  startLoop();
}

export function pause() {
  stopLoop();
  const clock = get('clock');
  set('clock', { ...clock, speed: 'paused' });
}

export function skipTo(isoString) {
  const clock = get('clock');
  set('clock', { ...clock, now: new Date(isoString) });
}
