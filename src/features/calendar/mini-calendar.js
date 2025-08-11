import { el, on } from '../../core/ui.js';
import { get, subscribe } from '../../core/store.js';
import { open, close } from '../layout/modal.js';

export function render(container) {
  function draw() {
    const now = get('clock').now;
    container.innerHTML = '';
    const list = el('ul', { class: 'list' });
    for (let i = 0; i < 4; i++) {
      const d = new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      list.append(el('li', {}, label));
    }
    container.append(list);
  }
  draw();
  subscribe('clock', draw);

  on(container, 'click', () => {
    const panel = el('div', { class: 'panel' },
      el('header', {}, el('span', {}, 'Calendar'), el('button', { class: 'collapse-btn' }, '✖')),
      el('div', { class: 'content' }, 'Full calendar (stub)')
    );
    on(panel.querySelector('.collapse-btn'), 'click', () => close(panel));
    open(panel);
  });
}
