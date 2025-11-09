/* Demonstration Stopwatch PWA */
let isRunning = false;
let startTime = 0;          // epoch ms when started (minus elapsed)
let elapsed = 0;            // ms
let rafId = null;
let marks = [];
const display = document.getElementById('timerDisplay');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const markBtn = document.getElementById('markBtn');
const eventsSection = document.getElementById('eventsSection');
const eventsList = document.getElementById('eventsList');
const copyBtn = document.getElementById('copyBtn');
const labelSelect = document.getElementById('labelSelect');
const infoBtn = document.getElementById('infoBtn');
const instructionsDialog = document.getElementById('instructionsDialog');

function formatTime(ms) {
  const hundredths = Math.floor(ms / 10);
  const minutes = Math.floor(hundredths / 6000);
  const seconds = Math.floor((hundredths % 6000) / 100);
  const h = hundredths % 100;
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(h).padStart(2,'0')}`;
}

function tick() {
  if (!isRunning) return;
  const now = performance.now();
  elapsed = now - startTime;
  display.textContent = formatTime(elapsed);
  rafId = requestAnimationFrame(tick);
}

function start() {
  if (isRunning) return;
  isRunning = true;
  startTime = performance.now() - elapsed;
  markBtn.disabled = false;
  startStopBtn.textContent = 'Stop';
  rafId = requestAnimationFrame(tick);
}

function stop() {
  if (!isRunning) return;
  isRunning = false;
  markBtn.disabled = true;
  startStopBtn.textContent = 'Start';
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

function reset() {
  stop();
  elapsed = 0;
  marks = [];
  display.textContent = '00:00.00';
  eventsList.innerHTML = '';
  eventsSection.classList.add('hidden');
}

function addMark() {
  const offset = elapsed;
  const label = labelSelect.value || 'Event';
  const idx = marks.length + 1;
  marks.push({ offset, createdAt: Date.now(), label });
  const li = document.createElement('li');
  li.innerHTML = `<span>#${idx} ${label} at</span><code>${formatTime(offset)}</code>`;
  eventsList.appendChild(li);
  eventsSection.classList.remove('hidden');
}

async function copyLog() {
  const header = 'Demonstration Stopwatch Log\n';
  const dt = new Date();
  const lines = [
    `Session end time: ${dt.toLocaleString()}`,
    `Total duration: ${formatTime(elapsed)}`
  ];
  if (marks.length === 0) {
    lines.push('No events marked.');
  } else {
    lines.push(`Events (${marks.length}):`);
    marks.forEach((m, i) => {
      lines.push(`  ${i+1}. ${m.label} at ${formatTime(m.offset)}`);
    });
  }
  const text = header + lines.join('\n');

  try {
    await navigator.clipboard.writeText(text);
    flash('Copied!');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    flash('Copied!');
  }
}

function flash(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.left = '50%';
  toast.style.bottom = '24px';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '10px 14px';
  toast.style.background = 'rgba(139,92,246,0.15)';
  toast.style.border = '1px solid rgba(250,204,21,0.6)';
  toast.style.borderRadius = '999px';
  toast.style.backdropFilter = 'blur(8px)';
  toast.style.color = '#fff';
  toast.style.zIndex = '9999';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

startStopBtn.addEventListener('click', () => (isRunning ? stop() : start()));
resetBtn.addEventListener('click', reset);
markBtn.addEventListener('click', addMark);
copyBtn.addEventListener('click', copyLog);
infoBtn.addEventListener('click', () => instructionsDialog.showModal());

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.log('SW reg failed', err));
  });
}
