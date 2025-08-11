export function resolveTitle(content, viewerLocale) {
  const titles = content.titles || {};
  const canonical = viewerLocale.split('-')[0];
  const chain = [viewerLocale, canonical, 'en', 'es', 'ko'];
  for (const loc of chain) {
    if (titles[loc]) return titles[loc];
  }
  return '<untitled>';
}

export function validateKoreanHangulOnly(str) {
  if (/[A-Za-z]/.test(str)) return false;
  return /^[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F0-9\s.,!?;:'"\-()]*$/.test(str);
}
