import { state, saveState, recordScore, THEMES, DAY_MS, SONG_NAMES } from './storage.js';
import { aiDaily } from './ai.js';

let nextTrackId = 1;
let nameIdx = 0;
let render = () => {};
function registerRender(fn){ render = fn; }
const promoCost = 1000;
const promoMult = {
  personal: { freedom:1.25, loyalty:1, ambition:0.75, morality:1, power:1 },
  corporate:{ freedom:1, loyalty:1.25, ambition:1, morality:0.75, power:1 },
  artificial:{ freedom:1, loyalty:1, ambition:1.25, morality:1, power:0.75 }
};
const payouts = [5000,4000,3000,2000,1800,1600,1400,1200,1000,800];

function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

function createTrack(owner, theme) {
  if (state.tracks.filter(t=>t.owner===owner && t.inCreationSlot).length>=5) return;
  const t = {
    id: nextTrackId++,
    owner,
    name: SONG_NAMES[nameIdx % SONG_NAMES.length],
    theme,
    stage:'sheet',
    daysAtStage:0,
    baseQuality: randomInt(40,90),
    weeksSinceRelease:0,
    postBonusThisWeek:0,
    inCreationSlot:true,
    feedback:[]
  };
  state.tracks.push(t);
  state[owner].slotsInUse++;
  nameIdx++;
}

function scrapTrack(id, owner) {
  const t = state.tracks.find(tr=>tr.id===id && tr.owner===owner);
  if (!t || t.stage==='released') return;
  t.stage='scrapped';
  t.inCreationSlot=false;
  state[owner].slotsInUse--;
}

function releaseTrack(id, owner) {
  const t = state.tracks.find(tr=>tr.id===id && tr.owner===owner);
  if (!t || t.stage!=='production') return;
  if (state[owner].cash < 1500) return;
  state[owner].cash -= 1500;
  t.stage='released';
  t.inCreationSlot=false;
  t.weeksSinceRelease=0;
  const pool = owner==='player'?state.prePromo:state.prePromoAI;
  const mult = strategy => promoMult[strategy][t.theme];
  const pre = 6 * (pool.personal*mult('personal') + pool.corporate*mult('corporate') + pool.artificial*mult('artificial'));
  t.baseQuality += pre;
  pool.personal=pool.corporate=pool.artificial=0;
}

function buyPromo(owner, target, strategy) {
  const label = state[owner];
  if (label.cash < promoCost) return;
  label.cash -= promoCost;
  if (target==='latest') {
    const latest = [...state.tracks].filter(t=>t.owner===owner && t.stage==='released').sort((a,b)=>b.id-a.id)[0];
    if (latest) {
      latest.postBonusThisWeek += 6 * promoMult[strategy][latest.theme];
    }
  } else {
    const pool = owner==='player'?state.prePromo:state.prePromoAI;
    pool[strategy]++;
  }
}

function advanceDay() {
  if (state.paused) return;
  state.dayInWeek++;
  if (state.dayInWeek>7) {
    state.dayInWeek=1;
    weeklyUpdate();
  }
  state.tracks.filter(t=>t.inCreationSlot).forEach(t=>{
    t.daysAtStage++;
    if (t.daysAtStage>=1) {
      completeStage(t);
    }
  });
  aiDaily({createTrack, releaseTrack, scrapTrack, buyPromo});
  render();
  saveState();
}

function completeStage(t) {
  const owner = t.owner;
  state[owner].cash -= 500;
  state[owner].catharsis -=5;
  t.daysAtStage=0;
  const roll = Math.random();
  const fb = roll<0.35?'good':roll<0.75?'neutral':'bad';
  t.feedback.unshift(fb);
  t.feedback=t.feedback.slice(0,2);
  if (t.stage==='sheet') t.stage='performance';
  else if (t.stage==='performance') t.stage='production';
  else if (t.stage==='production') {/* wait for release */}
}

function weeklyUpdate() {
  computeAudience();
  computeChart();
  payPayouts();
  applyQuietWeek();
  applyPrePromoPenalty();
  state.tracks.filter(t=>t.stage==='released').forEach(t=>{
    t.weeksSinceRelease++;
    t.postBonusThisWeek=0;
  });
  populationGrowth();
  state.week++;
  if (state.week>52) { state.week=1; state.year++; }
  clampAllCatharsis();
  saveState();
}

function computeAudience() {
  const pulls = state.pulls;
  const totals = {};
  THEMES.forEach(t=>totals[t]=0);
  state.chart.forEach(c=>{ totals[c.theme]=(totals[c.theme]||0)+c.points; });
  THEMES.forEach(t=>{
    pulls[t] = Math.max(0, pulls[t] - 0.00005*(totals[t]||0));
  });
  const sum = THEMES.reduce((a,b)=>a+pulls[b],0);
  THEMES.forEach(t=>{ pulls[t]= Math.round(state.population * (pulls[t]/sum)); });
}

function computeChart() {
  const themeBuckets = {};
  THEMES.forEach(t=>themeBuckets[t]=[]);
  state.tracks.filter(t=>t.stage==='released').forEach(t=>{ themeBuckets[t.theme].push(t); });
  const entries=[];
  THEMES.forEach(theme=>{
    const tracks=themeBuckets[theme];
    if (tracks.length===0) return;
    const scores=tracks.map(t=>{
      const Q = Math.max(0.40, Math.min(1.0, (t.baseQuality + t.postBonusThisWeek)/100));
      const D = Math.pow(1-0.15, t.weeksSinceRelease);
      const r = randBand(Q);
      const S = r*D;
      return {t,S};
    });
    const sumS=scores.reduce((a,b)=>a+b.S,0);
    const A = state.pulls[theme];
    scores.forEach(s=>{
      const pts = Math.floor(A * (s.S/sumS));
      entries.push({trackId:s.t.id, owner:s.t.owner, name:s.t.name, points:pts, theme});
    });
  });
  entries.sort((a,b)=>b.points-a.points);
  state.chart = entries.slice(0,10).map((e,i)=>({rank:i+1, ...e}));
  const sortedThemes = [...THEMES].sort((a,b)=>state.pulls[b]-state.pulls[a]);
  state.trend = sortedThemes[0];
  state.topTrends = sortedThemes.slice(0,3);
  checkWinLoss();
}

function randBand(Q) {
  const r = Math.random();
  if (Q<0.50) return 0.01 + r*(0.03-0.01);
  if (Q<0.65) return 0.03 + r*(0.06-0.03);
  if (Q<0.80) return 0.06 + r*(0.10-0.06);
  return 0.10 + r*(0.16-0.10);
}

function payPayouts() {
  state.chart.forEach(e=>{
    if (e.rank<=payouts.length) {
      const cash = payouts[e.rank-1];
      state[e.owner].cash += cash;
      if (e.rank===1) state[e.owner].catharsis +=15;
      else if (e.rank===2) state[e.owner].catharsis +=10;
      else if (e.rank===3) state[e.owner].catharsis +=5;
    }
  });
}

function applyQuietWeek() {
  ['player','ai'].forEach(owner=>{
    const releasedThisWeek = state.chart.some(e=>e.owner===owner && e.trackId && state.tracks.find(t=>t.id===e.trackId).weeksSinceRelease===0);
    if (!releasedThisWeek) state[owner].catharsis -=5;
  });
}

function applyPrePromoPenalty() {
  const p=state.prePromo; if(p.personal||p.corporate||p.artificial){ state.player.catharsis-=10; state.player.cash-=5000; p.personal=p.corporate=p.artificial=0;}
  const a=state.prePromoAI; if(a.personal||a.corporate||a.artificial){ state.ai.catharsis-=10; state.ai.cash-=5000; a.personal=a.corporate=a.artificial=0;}
}

function populationGrowth() {
  state.population = Math.min(2_000_000, Math.round(state.population*(1+0.002)));
}

function clampAllCatharsis() {
  ['player','ai'].forEach(owner=>{
    state[owner].catharsis = Math.max(-100, Math.min(100, state[owner].catharsis));
  });
}

function checkWinLoss() {
  const top5 = state.chart.slice(0,5);
  if (state.devMode) return; // no loss in dev mode
  if (top5.every(e=>e.owner==='ai')) {
    showModal('Loss: AI dominates Top 5'); state.paused=true;
  } else if (top5.every(e=>e.owner==='player')) {
    const weeks = state.week + (state.year-2400)*52;
    recordScore(weeks);
    const scores = state.scoreboard.map(s=>`${s.difficulty}: ${s.weeks}`).join('\n');
    showModal('Win! Player dominates Top 5\n\nScoreboard:\n' + scores);
    state.paused=true;
  }
  if (state.player.cash<=0) { showModal('Loss: Out of cash'); state.paused=true; }
  if (state.player.catharsis<=-100) { state.player.cash-=5000; state.player.catharsis=0; if (state.player.cash<=0) { showModal('Loss: Out of cash'); state.paused=true; } }
}






function showModal(text) {
  const m=document.getElementById('modal');
  m.textContent=text; m.classList.remove('hidden');
}

setInterval(advanceDay, DAY_MS);

export { createTrack, releaseTrack, scrapTrack, buyPromo, advanceDay, registerRender };
