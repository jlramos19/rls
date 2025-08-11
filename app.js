import { TimeController } from './timeController.js';
import { chartEntries, getTitle } from './demoSeed.js';
import { createListRow } from './listRow.js';
import { createResizablePanel } from './resizablePanel.js';

const timeController = new TimeController();
const clockLabel = document.getElementById('game-clock');

function formatDate(date) {
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const day = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayNum = String(date.getDate()).padStart(2,'0');
  let hour = date.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12; if (hour === 0) hour = 12;
  return `${day} - ${month} ${dayNum}, ${date.getFullYear()} - ${hour}${ampm}`;
}

timeController.addEventListener('time_tick', e => {
  clockLabel.textContent = formatDate(e.detail);
});

clockLabel.textContent = formatDate(timeController.ingameDate);

document.getElementById('btn-pause').onclick = () => timeController.pause();
document.getElementById('btn-play').onclick = () => timeController.playNormal();
document.getElementById('btn-fast').onclick = () => timeController.playFast();
document.getElementById('btn-skip').onclick = () => {
  const input = prompt('Enter date YYYY-MM-DD:', '2400-01-01');
  if (input) timeController.skipTo(input + 'T00:00:00');
};

// Charts view
const chartsView = document.getElementById('charts-view');
chartEntries.forEach(entry => {
  const title = getTitle(entry.content_id, 'en');
  const row = createListRow('https://via.placeholder.com/24', `${entry.rank}. ${title}`, '', null);
  chartsView.append(row);
});

// Calendar weeks
const calendarWeeks = document.getElementById('calendar-weeks');
let d = new Date(timeController.ingameDate);
for (let i = 0; i < 4; i++) {
  const week = document.createElement('div');
  week.textContent = `Week ${i + 1}: ${d.toISOString().substring(0, 10)}`;
  calendarWeeks.append(week);
  d.setDate(d.getDate() + 7);
}

document.getElementById('open-calendar').onclick = () => alert('Calendar popup');

document.querySelectorAll('.open-popup').forEach(btn => {
  btn.addEventListener('click', () => {
    const { panel, content } = createResizablePanel(btn.textContent);
    content.textContent = `Placeholder for ${btn.dataset.popup}`;
    document.getElementById('popup-container').append(panel);
  });
});

document.getElementById('settings-button').onclick = () => {
  const { panel, content } = createResizablePanel('Settings');
  content.innerHTML = '<button disabled>Save</button><button disabled>Load</button><button disabled>Exit to Menu</button>';
  document.getElementById('popup-container').append(panel);
};

document.getElementById('wallet-button').onclick = () => {
  const { panel, content } = createResizablePanel('Wallet');
  content.textContent = 'Wallet contents';
  document.getElementById('popup-container').append(panel);
};

document.getElementById('open-recipes').onclick = () => {
  const { panel, content } = createResizablePanel('Recipes');
  content.textContent = 'List of recipes';
  document.getElementById('popup-container').append(panel);
};
