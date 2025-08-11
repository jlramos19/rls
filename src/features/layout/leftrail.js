import { qs, el, on } from '../../core/ui.js';
import { init as makeResizable } from './resizable-panel.js';

export function init() {
  const rail = qs('#leftrail');
  const workspace = qs('#workspace');
  const buttons = [
    { id: 'areas', label: 'Areas' },
    { id: 'creators', label: 'Creators' },
    { id: 'items', label: 'Items and Tools' },
    { id: 'collabs', label: 'Collabs' }
  ];
  for (const b of buttons) {
    const btn = el('button', {}, b.label);
    on(btn, 'click', () => openPanel(b.label));
    rail.appendChild(btn);
  }

  function openPanel(title) {
    const panel = el('div', { class: 'panel', style: 'top:80px;left:240px;width:300px;height:300px;' },
      el('header', {}, el('span', {}, title), el('button', { class: 'collapse-btn' }, '⌄')),
      el('div', { class: 'content' }, 'Placeholder'),
      el('div', { class: 'grip-x' }),
      el('div', { class: 'grip-y' })
    );
    workspace.appendChild(panel);
    makeResizable(panel);
  }
}
