export const creators = [];
export const content = [];

export function seedDemo() {
  if (creators.length || content.length) return;
  for (let i = 0; i < 100; i++) {
    creators.push({ id: i + 1, stageName: `Creator ${i + 1}`, country: 'US' });
  }
  for (let i = 0; i < 1000; i++) {
    content.push({
      id: i + 1,
      type: 'track',
      canonical_country: 'US',
      canonical_locale: 'en',
      titles: { en: `Track ${i + 1}`, es: `Pista ${i + 1}`, ko: `트랙${i + 1}` }
    });
  }
}
