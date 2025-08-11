export const qs = (sel, el = document) => el.querySelector(sel);
export const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on') && typeof v === 'function') {
      element.addEventListener(k.slice(2), v);
    } else if (v !== false && v != null) {
      element.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const child of children) {
    if (typeof child === 'string') element.appendChild(document.createTextNode(child));
    else if (child) element.appendChild(child);
  }
  return element;
}

export const on = (el, event, fn) => el.addEventListener(event, fn);
export const emit = (el, name, detail = {}) => el.dispatchEvent(new CustomEvent(name, { detail }));

export function trapFocus(container) {
  const focusable = qsa('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])', container);
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  function handle(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  container.addEventListener('keydown', handle);
  return () => container.removeEventListener('keydown', handle);
}
