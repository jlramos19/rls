import { qs, el, on } from '../../core/ui.js';
import { subscribe, set } from '../../core/store.js';
import * as time from '../../core/time.js';
import { open, close } from './modal.js';

function formatClock(date) {
  return date.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  }).replace(',', '').replace(',', '');
}

export function init() {
  const top = qs('#topbar');

  const clockLabel = el('span', { id: 'clock-label', 'aria-live': 'polite' }, '');
  const pauseBtn = el('button', { 'aria-label': 'Pause' }, '⏸');
  const playBtn = el('button', { 'aria-label': 'Play' }, '▶');
  const fastBtn = el('button', { 'aria-label': 'Fast' }, '⏩');
  const skipBtn = el('button', { 'aria-label': 'Skip' }, '⏭');
  const localeSelect = el('select', {},
    el('option', { value: 'en' }, 'EN'),
    el('option', { value: 'es' }, 'ES'),
    el('option', { value: 'ko' }, 'KO')
  );
  const settingsBtn = el('button', { 'aria-label': 'Settings' }, '⚙');

  const center = el('div', {},
    clockLabel,
    el('div', {}, pauseBtn, playBtn, fastBtn, skipBtn),
    localeSelect
  );
  const left = el('div', {}, el('div', {}, 'Wallet: ', el('button', { id: 'wallet-btn' }, '$0')));
  const right = el('div', {}, settingsBtn);
  top.append(left, center, right);

  subscribe('clock', ({ now }) => {
    clockLabel.textContent = formatClock(now);
  });

  subscribe('viewerLocale', loc => {
    localeSelect.value = loc;
  });

  on(localeSelect, 'change', e => set('viewerLocale', e.target.value));
  on(pauseBtn, 'click', () => time.pause());
  on(playBtn, 'click', () => time.playNormal());
  on(fastBtn, 'click', () => time.playFast());
  on(skipBtn, 'click', () => {
    const input = el('input', { type: 'date' });
    const ok = el('button', {}, 'Go');
    const panel = el('div', { class: 'panel' },
      el('header', {}, el('span', {}, 'Skip To'), el('button', { class: 'collapse-btn' }, '✖')),
      el('div', { class: 'content' }, input, ok)
    );
    on(panel.querySelector('.collapse-btn'), 'click', () => close(panel));
    on(ok, 'click', () => { time.skipTo(input.value + 'T00:00:00Z'); close(panel); });
    open(panel);
  });

  on(settingsBtn, 'click', () => {
    const panel = el('div', { class: 'panel' },
      el('header', {}, el('span', {}, 'Settings'), el('button', { class: 'collapse-btn' }, '✖')),
      el('div', { class: 'content' }, 'Save (stub)')
    );
    on(panel.querySelector('.collapse-btn'), 'click', () => close(panel));
    open(panel);
  });
}
