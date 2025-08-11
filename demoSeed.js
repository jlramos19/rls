import { resolve } from './titleResolver.js';

export const contents = [
  { id: 1, titles: { ko: '버터', en: 'Butter' } },
  { id: 2, titles: { en: 'Fake Love', ko: '페이크 러브' } }
];

export const chartEntries = Array.from({ length: 10 }, (_, i) => ({
  week: '2400-W01',
  content_id: i % 2 ? 2 : 1,
  rank: i + 1,
  status_flags: ''
}));

export function getTitle(content_id, locale) {
  const content = contents.find(c => c.id === content_id);
  return content ? resolve(content.titles, locale) : '<untitled>';
}
