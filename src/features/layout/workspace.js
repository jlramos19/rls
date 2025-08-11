import { qs } from '../../core/ui.js';
import { render as renderCharts } from '../charts/charts-view.js';

const container = qs('#workspace');
const views = { charts: renderCharts };
let current = null;

export function init() {
  show('charts');
}

export function show(viewId) {
  container.innerHTML = '';
  const render = views[viewId];
  if (render) {
    current = viewId;
    render(container);
  }
}
