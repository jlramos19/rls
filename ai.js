import { state, THEMES } from './storage.js';

function aiDaily(helpers) {
  const {createTrack, releaseTrack} = helpers;
  const ai = state.ai;
  if (ai.slotsInUse < 2 && state.tracks.filter(t=>t.owner==='ai' && t.inCreationSlot).length < 3) {
    const theme = pickTheme();
    createTrack('ai', theme);
  }
  const creations = state.tracks.filter(t=>t.owner==='ai' && t.inCreationSlot && t.stage==='production');
  creations.forEach(t=>{
    if (ai.cash >= 1500) releaseTrack(t.id, 'ai');
  });
}

function pickTheme() {
  let top = THEMES[0];
  let max = state.pulls[top];
  THEMES.forEach(t=>{ if (state.pulls[t] > max) { top = t; max = state.pulls[t]; } });
  return top;
}

export { aiDaily };
