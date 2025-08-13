import { state, THEMES } from './storage.js';
import { createTrack, releaseTrack, scrapTrack, buyPromo, advanceDay, registerRender } from "./game.js";

let selected = null;
let promoMode = false;
let promoTarget = 'latest';

function renderTop() {
  document.getElementById('date').textContent = `Year ${state.year} — Week ${state.week}/52 Day ${state.dayInWeek}`;
  document.getElementById('cash').textContent = `Cash: $${state.player.cash}`;
  document.getElementById('catharsis').textContent = `Catharsis: ${state.player.catharsis}`;
  document.getElementById('trend').textContent = `TREND: ${state.trend||''}`;
}

function renderTracks() {
  const panel = document.getElementById('track-panel');
  panel.innerHTML='';
  state.tracks.forEach((t,i)=>{
    const div=document.createElement('div');
    div.className='track'+(t.stage==='released'?' released':'');
    div.textContent=`${t.name}\nStage:${t.stage}\nFeedback:${t.feedback.join(',')}`;
    div.onclick=()=>{ selected=i; renderTracks(); };
    if (selected===i) div.style.border='2px solid red';
    panel.appendChild(div);
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
  const key = prompt('Choose theme F/L/A/M/P');
  const map={F:'freedom',L:'loyalty',A:'ambition',M:'morality',P:'power'};
  const theme=map[key.toUpperCase()];
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
  const strategy = prompt('Strategy: personal, corporate, artificial');
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
  });
}

setupButtons();
setupKeys();
registerRender(renderAll);
renderAll();

export { renderAll };
