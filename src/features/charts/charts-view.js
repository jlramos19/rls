import { el } from '../../core/ui.js';
import { chartEntries } from './demo-charts-data.js';
import { content } from '../../data/demo-seed.js';
import { resolveTitle } from '../../core/i18n.js';
import { get, subscribe } from '../../core/store.js';

export function render(container) {
  const list = el('ul', { class: 'list' });
  container.append(el('h2', {}, 'Top 10'), list);

  function redraw() {
    const locale = get('viewerLocale');
    list.innerHTML = '';
    for (const entry of chartEntries) {
      const c = content.find(c => c.id === entry.contentId);
      const title = resolveTitle(c, locale);
      list.append(el('li', {}, `#${entry.rank} ${title}`));
    }
  }

  redraw();
  subscribe('viewerLocale', redraw);
}
