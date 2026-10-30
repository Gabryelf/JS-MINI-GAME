/* ====================== AUDIO ====================== */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not available', e);
    }
  }
}

function playTone(freq, dur, type = 'sine', vol = 0.15, slideTo = null) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

function soundGood() {
  playTone(660, 0.12, 'triangle', 0.18);
  setTimeout(() => playTone(880, 0.18, 'triangle', 0.18), 90);
  setTimeout(() => playTone(1320, 0.25, 'triangle', 0.15), 180);
}

function soundBad() {
  playTone(220, 0.25, 'sawtooth', 0.18, 80);
}

function soundWin() {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.3, 'triangle', 0.18), i * 120)
  );
}

function soundLose() {
  [400, 340, 280, 200].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.35, 'sawtooth', 0.15), i * 140)
  );
}