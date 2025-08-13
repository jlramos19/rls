const DAY_MS = 1000;
const THEMES = ['freedom','loyalty','ambition','morality','power'];

const defaultState = () => ({
  year: 2400,
  week: 1,
  dayInWeek: 1,
  paused: false,
  difficulty: null,
  player: { cash: 10000, catharsis: 0, slotsInUse: 0 },
  ai:      { cash: 10000, catharsis: 0, slotsInUse: 0 },
  tracks: [],
  chart: [],
  population: 1_000_000,
  pulls: { freedom:0, loyalty:0, ambition:0, morality:0, power:0 },
  prePromo: { personal:0, corporate:0, artificial:0 },
  prePromoAI: { personal:0, corporate:0, artificial:0 },
  scoreboard: []
});

let state = loadState();

function loadState() {
  const saved = localStorage.getItem('rls-state');
  if (saved) return JSON.parse(saved);
  const s = defaultState();
  const perTheme = Math.round(s.population / THEMES.length);
  THEMES.forEach(t=>s.pulls[t]=perTheme);
  return s;
}

function saveState() {
  localStorage.setItem('rls-state', JSON.stringify(state));
}

function resetState() {
  state = defaultState();
  saveState();
}

function recordScore(weeks) {
  state.scoreboard.push(weeks);
  state.scoreboard.sort((a,b)=>a-b);
  saveState();
}

export { state, saveState, resetState, recordScore, DAY_MS, THEMES };
