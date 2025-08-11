import { trapFocus, on } from '../../core/ui.js';
import { get, set } from '../../core/store.js';

const root = document.getElementById('modal-root');

export function open(node) {
  root.appendChild(node);
  root.style.pointerEvents = 'auto';
  const release = trapFocus(node);
  function handleEsc(e) {
    if (e.key === 'Escape') close(node);
  }
  on(node, 'keydown', handleEsc);
  const stack = get('modals') || [];
  stack.push({ node, release, handleEsc });
  set('modals', stack);
}

export function close(node) {
  const stack = get('modals') || [];
  const idx = stack.findIndex(m => m.node === node);
  if (idx === -1) return;
  const { release, handleEsc } = stack[idx];
  release && release();
  node.removeEventListener('keydown', handleEsc);
  node.remove();
  stack.splice(idx, 1);
  set('modals', stack);
  if (!stack.length) root.style.pointerEvents = 'none';
}
