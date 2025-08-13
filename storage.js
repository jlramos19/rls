const DAY_MS = 1000;
const THEMES = ['freedom','loyalty','ambition','morality','power'];
const THEME_COLORS = {
  freedom: '#ffb347',
  loyalty: '#7ec8e3',
  ambition: '#c3aed6',
  morality: '#a8e6cf',
  power: '#ff6961'
};

const SONG_NAMES = [
  'Midnight Echo',
  'Solar Winds',
  'Neon Rain',
  'Crystal Dawn',
  'Digital Dreams',
  'Velvet Horizon',
  'Infinite Pulse',
  'Chrome Waves',
  'Silent Thunder',
  'Spectrum Shift'
];

const defaultState = () => ({
  year: 2400,
  week: 1,
  dayInWeek: 1,
  paused: false,
  difficulty: null,
  devMode: false,
  tutorialShown: false,
  player: { cash: 10000, catharsis: 0, slotsInUse: 0 },
  ai:      { cash: 10000, catharsis: 0, slotsInUse: 0 },
  tracks: [],
  chart: [],
  population: 1_000_000,
  pulls: { freedom:0, loyalty:0, ambition:0, morality:0, power:0 },
  prePromo: { personal:0, corporate:0, artificial:0 },
  prePromoAI: { personal:0, corporate:0, artificial:0 },
  scoreboard: [],
  topTrends: []
});

let state = loadState();

function loadState() {
  const saved = localStorage.getItem('rls-state');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.scoreboard) && parsed.scoreboard.length && typeof parsed.scoreboard[0] === 'number') {
      parsed.scoreboard = parsed.scoreboard.map(w => ({ weeks: w, difficulty: 'Unknown' }));
    }
    return parsed;
  }
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
  state.scoreboard.push({ weeks, difficulty: state.difficulty });
  state.scoreboard.sort((a,b)=>a.weeks-b.weeks);
  saveState();
}

export { state, saveState, resetState, recordScore, DAY_MS, THEMES, THEME_COLORS, SONG_NAMES };
