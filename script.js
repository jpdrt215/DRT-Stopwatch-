// Version and splash delay
const APP_VERSION = 'v4';
const SPLASH_DELAY_MS = 2500;

// Ensure old SW doesn’t cache old layout
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
}

// Splash fade
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  const timer  = document.getElementById('timer');
  setTimeout(() => {
    splash.classList.add('fading');
    splash.addEventListener('transitionend', () => {
      splash.style.display = 'none';
      timer.classList.remove('hidden');
    }, { once: true });
  }, SPLASH_DELAY_MS);
});

// ------- Stopwatch (HH:MM:SS) -------
let elapsed = 0;     // seconds
let tick = null;     // setInterval id
const display  = document.getElementById('display');
const startBtn = document.getElementById('start');
const stopBtn  = document.getElementById('stop');
const resetBtn = document.getElementById('reset');     // big bottom
const resetAll = document.getElementById('resetAll');  // clears log & timer
const copyBtn  = document.getElementById('copy');
const listEl   = document.getElementById('list');

function formatHMS(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function render() { display.textContent = formatHMS(elapsed); }

function startTimer() {
  if (tick) return;
  tick = setInterval(() => { elapsed += 1; render(); }, 1000);
}
function stopTimer() {
  clearInterval(tick); tick = null;
  // Log the result when stopping
  const li = document.createElement('li');
  li.textContent = formatHMS(elapsed);
  listEl.appendChild(li);
}
function resetAndStart() {
  elapsed = 0;
  render();
  clearInterval(tick); tick = null;
  startTimer();
}
function resetEverything() {
  // Stop, clear time, clear log
  clearInterval(tick); tick = null;
  elapsed = 0; render();
  listEl.innerHTML = '';
}
async function copyLog() {
  const items = [...listEl.querySelectorAll('li')].map(li => li.textContent);
  const text = items.length ? items.map((t, i) => `${i+1}. ${t}`).join('\n') : 'No results';
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!'; setTimeout(()=>copyBtn.textContent='Copy log', 1000);
  } catch {
    copyBtn.textContent = 'Copy failed'; setTimeout(()=>copyBtn.textContent='Copy log', 1200);
  }
}

startBtn .addEventListener('click', startTimer);
stopBtn  .addEventListener('click', stopTimer);
resetBtn .addEventListener('click', resetAndStart);
resetAll .addEventListener('click', resetEverything);
copyBtn  .addEventListener('click', copyLog);

// First paint
render();
