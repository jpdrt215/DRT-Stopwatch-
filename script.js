// Delay before splash fades (in milliseconds)
const SPLASH_DELAY_MS = 2500; // 2.5 seconds

window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  const timer = document.getElementById('timer');

  setTimeout(() => {
    splash.classList.add('fading');
    splash.addEventListener('transitionend', () => {
      splash.style.display = 'none';
      timer.classList.remove('hidden');
    }, { once: true });
  }, SPLASH_DELAY_MS);
});

// Simple Stopwatch
let elapsed = 0;
let tick = null;
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const stopBtn  = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

function format(t) {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function render() {
  display.textContent = format(elapsed);
}

startBtn.addEventListener('click', () => {
  if (tick) return;
  tick = setInterval(() => { elapsed += 1; render(); }, 1000);
});

stopBtn.addEventListener('click', () => {
  clearInterval(tick);
  tick = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(tick);
  tick = null;
  elapsed = 0;
  render();
});

render();
