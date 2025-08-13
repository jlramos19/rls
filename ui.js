import { state, THEMES, THEME_COLORS } from './storage.js';
import { createTrack, releaseTrack, scrapTrack, buyPromo, advanceDay, registerRender } from "./game.js";

let selected = null;
let promoMode = false;
let promoTarget = 'latest';

function renderTop() {
  document.getElementById('date').textContent = `Year ${state.year} — Week ${state.week}/52 Day ${state.dayInWeek}`;
  document.getElementById('cash').textContent = `Cash: $${state.player.cash}`;
  document.getElementById('catharsis').textContent = `Catharsis: ${state.player.catharsis}`;
  const trendText = state.topTrends && state.topTrends.length ? state.topTrends.join(', ') : '';
  document.getElementById('trend').textContent = `TOP TRENDS: ${trendText}`;
}

function renderTracks() {
  const panel = document.getElementById('track-panel');
  const relPanel = document.getElementById('released-panel');
  panel.innerHTML='';
  relPanel.innerHTML='';
  const tracks = state.tracks.filter(t=>t.stage!=='scrapped');
  tracks.forEach((t,i)=>{
    const div=document.createElement('div');
    div.className='track'+(t.stage==='released'?' released':'');
    div.innerHTML=`<strong>${t.name}</strong><br>Theme: <span style="color:${THEME_COLORS[t.theme]}">${t.theme}</span><br>Stage:${t.stage}<br>Feedback:${t.feedback.join(',')}`;
    div.onclick=()=>{ selected=i; renderTracks(); };
    if (selected===i) div.style.border='2px solid red';
    if (t.stage==='released') relPanel.appendChild(div); else panel.appendChild(div);
  });
}

function renderChart() {
  const tbody=document.querySelector('#charts-table tbody');
  tbody.innerHTML='';
  state.chart.forEach(e=>{
    const tr=document.createElement('tr');
    if (e.owner==='player') tr.style.background='#dfd';
    tr.innerHTML=`<td>${e.rank}</td><td>${e.name}</td><td>${e.owner}</td><td>${e.points}</td>`;
    tbody.appendChild(tr);
  });
}

function renderAll() { renderTop(); renderTracks(); renderChart(); }

function setupButtons() {
  document.getElementById('pause-btn').onclick=()=>state.paused=!state.paused;
  document.getElementById('skip-btn').onclick=()=>{ for(let i=0;i<3;i++) advanceDay(); };
  document.getElementById('create-btn').onclick=()=>startCreate();
  document.getElementById('release-btn').onclick=()=>doRelease();
  document.getElementById('scrap-btn').onclick=()=>doScrap();
  document.getElementById('promo-btn').onclick=()=>startPromo();
}

function startCreate() {
  if (state.player.slotsInUse>=5) return alert('No slots');
  const key = prompt('Choose theme:\n1-Freedom 2-Loyalty 3-Ambition 4-Morality 5-Power');
  const map={
    '1':'freedom','2':'loyalty','3':'ambition','4':'morality','5':'power',
    'F':'freedom','L':'loyalty','A':'ambition','M':'morality','P':'power'
  };
  const theme=map[key.toUpperCase?key.toUpperCase():key];
  if (theme) createTrack('player', theme);
}

function doRelease() {
  if (selected==null) return;
  const t=state.tracks[selected];
  if (t.stage==='production') releaseTrack(t.id,'player');
}

function doScrap() {
  if (selected==null) return;
  const t=state.tracks[selected];
  if (t.stage!=='released') scrapTrack(t.id,'player');
}

function startPromo() {
  const target = prompt('Promo target: latest or tease?');
  const info = 'Strategies:\nPersonal:+Freedom/+Loyalty/-Ambition\nCorporate:+Loyalty/+Ambition/-Morality\nArtificial:+Freedom/+Morality/-Power';
  const strategy = prompt(info + '\nChoose strategy: personal, corporate, artificial');
  if (['latest','tease'].includes(target) && ['personal','corporate','artificial'].includes(strategy)) {
    buyPromo('player', target==='latest'?'latest':'tease', strategy);
  }
}

function setupKeys() {
  document.addEventListener('keydown', e=>{
    if (e.key===' ') { state.paused=!state.paused; }
    else if (e.key==='ArrowRight') { for(let i=0;i<3;i++) advanceDay(); }
    else if (e.key==='c' || e.key==='C') startCreate();
    else if (e.key==='r' || e.key==='R') doRelease();
    else if (e.key==='s' || e.key==='S') doScrap();
    else if (e.key==='p' || e.key==='P') startPromo();
    else if (e.key==='ArrowUp') { if (selected===null) selected=0; else selected=Math.max(0,selected-1); renderTracks(); }
    else if (e.key==='ArrowDown') { if (selected===null) selected=0; else selected=Math.min(state.tracks.length-1,selected+1); renderTracks(); }
    else if (e.key==='d' || e.key==='D') { state.devMode=!state.devMode; alert('Dev mode '+(state.devMode?'ON':'OFF')); }
  });
}

setupButtons();
setupKeys();
registerRender(renderAll);
renderAll();
if (!state.tutorialShown) {
  alert('Goal: dominate the Top 5 with your tracks. Use buttons or keys to create (C), promote (P), release (R). Use numbers 1-5 to select themes.');
  state.tutorialShown = true;
}

export { renderAll };
