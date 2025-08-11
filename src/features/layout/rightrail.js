import { qs, el } from '../../core/ui.js';
import { render as renderMiniCalendar } from '../calendar/mini-calendar.js';

export function init() {
  const rail = qs('#rightrail');
  rail.append(el('div', {}, 'Quests (stub)'));
  const cal = el('div', { id: 'mini-cal' });
  rail.append(cal);
  renderMiniCalendar(cal);
}
