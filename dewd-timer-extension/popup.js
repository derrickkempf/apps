const TOTAL = 15 * 60; // 15 minutes in seconds

let remaining = TOTAL;
let running   = false;
let endTime   = null;
let ticker    = null;

const clockEl  = document.getElementById('clockText');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// ── Formatting ────────────────────────────────────────────────────────────
function fmt(s) {
  const m   = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return m + ':' + sec;
}

// ── Render ────────────────────────────────────────────────────────────────
function render() {
  clockEl.textContent = fmt(remaining);

  if (running) {
    startBtn.textContent = 'Pause';
    startBtn.style.background = '#e8e8e8';
    startBtn.style.color = '#000';
  } else if (remaining < TOTAL && remaining > 0) {
    startBtn.textContent = 'Resume';
    startBtn.style.background = '#fff';
    startBtn.style.color = '#000';
  } else {
    startBtn.textContent = 'Start';
    startBtn.style.background = '#fff';
    startBtn.style.color = '#000';
  }

  // When done, pulse the clock
  if (remaining === 0) {
    clockEl.style.fill = '#ccc';
  } else {
    clockEl.style.fill = '#fff';
  }
}

// ── Timer control ─────────────────────────────────────────────────────────
function start() {
  endTime = Date.now() + remaining * 1000;
  running = true;
  clearInterval(ticker);
  ticker = setInterval(() => {
    remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    render();
    if (remaining <= 0) {
      clearInterval(ticker);
      running = false;
      render();
      // Persist done state
      chrome.storage.local.set({ remaining: 0, running: false, endTime: null });
    }
  }, 250);
  render();
  chrome.storage.local.set({ running: true, endTime });
}

function pause() {
  clearInterval(ticker);
  running = false;
  render();
  chrome.storage.local.set({ running: false, endTime: null, remaining });
}

function reset() {
  clearInterval(ticker);
  running   = false;
  remaining = TOTAL;
  endTime   = null;
  render();
  chrome.storage.local.set({ running: false, endTime: null, remaining: TOTAL });
}

// ── Events ────────────────────────────────────────────────────────────────
startBtn.addEventListener('click', () => {
  if (running) {
    pause();
  } else if (remaining > 0) {
    start();
  }
});

resetBtn.addEventListener('click', reset);

// ── Restore state on popup open ───────────────────────────────────────────
chrome.storage.local.get(['remaining', 'running', 'endTime'], (data) => {
  // Restore remaining
  if (typeof data.remaining === 'number') {
    remaining = data.remaining;
  }

  // If it was running, recalculate from endTime
  if (data.running && data.endTime) {
    const recalculated = Math.max(0, Math.round((data.endTime - Date.now()) / 1000));
    remaining = recalculated;
    if (remaining > 0) {
      start(); // resume the ticker
    } else {
      remaining = 0;
      running = false;
    }
  }

  render();
});
