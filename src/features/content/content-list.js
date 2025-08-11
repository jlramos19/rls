import { el, on } from '../../core/ui.js';
import { content } from '../../data/demo-seed.js';
import { resolveTitle } from '../../core/i18n.js';
import { get, subscribe } from '../../core/store.js';
import { openEditor } from './localization-editor.js';

export function render(container) {
  const list = el('ul', { class: 'list' });
  container.append(el('h2', {}, 'Content'), list);

  function draw() {
    const locale = get('viewerLocale');
    list.innerHTML = '';
    for (const item of content.slice(0, 20)) {
      const li = el('li', {}, resolveTitle(item, locale));
      on(li, 'click', () => openEditor(item));
      list.append(li);
    }
  }
  draw();
  subscribe('viewerLocale', draw);
}
