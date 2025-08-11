import { qs, el } from '../../core/ui.js';

export function init() {
  const bar = qs('#bottombar');
  const promote = el('button', {}, 'Promote Content');
  const dialogue = el('div', {},
    el('img', { src: '../assets/placeholders/npc.png', alt: 'NPC', width: 48, height: 48 }),
    el('span', {}, 'Hello there')
  );
  const social = el('button', {}, 'eyeriSocial');
  bar.append(promote, dialogue, social);
}
