import { on, emit } from '../../core/ui.js';

const SNAP = 12;
const MIN = 220;

export function init(panel) {
  const gripX = panel.querySelector('.grip-x');
  const gripY = panel.querySelector('.grip-y');
  const collapseBtn = panel.querySelector('.collapse-btn');

  let startW, startH, startX, startY, dragX, dragY;

  function pointerdown(e, axis) {
    startW = panel.offsetWidth;
    startH = panel.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;
    dragX = axis === 'x' || axis === 'both';
    dragY = axis === 'y' || axis === 'both';
    on(document, 'pointermove', pointermove);
    on(document, 'pointerup', pointerup);
  }

  function pointermove(e) {
    if (dragX) {
      let w = startW + (e.clientX - startX);
      w = Math.max(MIN, Math.round(w / SNAP) * SNAP);
      panel.style.width = w + 'px';
    }
    if (dragY) {
      let h = startH + (e.clientY - startY);
      h = Math.max(MIN, Math.round(h / SNAP) * SNAP);
      panel.style.height = h + 'px';
    }
  }

  function pointerup() {
    dragX = dragY = false;
    document.removeEventListener('pointermove', pointermove);
    document.removeEventListener('pointerup', pointerup);
    emit(panel, 'panel:resized', { width: panel.offsetWidth, height: panel.offsetHeight });
  }

  gripX && on(gripX, 'pointerdown', e => pointerdown(e, 'x'));
  gripY && on(gripY, 'pointerdown', e => pointerdown(e, 'y'));

  if (collapseBtn) {
    on(collapseBtn, 'click', () => {
      panel.classList.toggle('is-collapsed');
      emit(panel, 'panel:collapsed', { collapsed: panel.classList.contains('is-collapsed') });
    });
  }
}
