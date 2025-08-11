export function resolve(content, viewerLocale) {
  if (viewerLocale && content[viewerLocale]) {
    return content[viewerLocale];
  }
  const canonical = viewerLocale ? viewerLocale.split('-')[0] : '';
  if (canonical && content[canonical]) {
    return content[canonical];
  }
  if (content['en']) return content['en'];
  if (content['es']) return content['es'];
  if (content['ko']) return content['ko'];
  return '<untitled>';
}

export function validateKoreanHangulOnly(title) {
  return /^[\u3131-\u318E\uAC00-\uD7A3\s]+$/.test(title);
}
