import { el, on } from '../../core/ui.js';
import { validateKoreanHangulOnly } from '../../core/i18n.js';
import { open, close } from '../layout/modal.js';

export function openEditor(item) {
  const en = el('input', { value: item.titles.en || '', placeholder: 'English' });
  const es = el('input', { value: item.titles.es || '', placeholder: 'Spanish' });
  const ko = el('input', { value: item.titles.ko || '', placeholder: 'Korean' });
  const save = el('button', {}, 'Save');

  function validate() {
    const ok = validateKoreanHangulOnly(ko.value);
    ko.style.borderColor = ok ? '' : 'red';
    save.disabled = !ok;
  }
  on(ko, 'input', validate);
  validate();

  const panel = el('div', { class: 'panel' },
    el('header', {}, el('span', {}, 'Localization'), el('button', { class: 'collapse-btn' }, '✖')),
    el('div', { class: 'content' }, en, es, ko, save)
  );
  on(panel.querySelector('.collapse-btn'), 'click', () => close(panel));
  on(save, 'click', () => {
    item.titles.en = en.value || undefined;
    item.titles.es = es.value || undefined;
    item.titles.ko = ko.value || undefined;
    close(panel);
  });
  open(panel);
}
