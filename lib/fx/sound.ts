/* Sonido sintetizado con Web Audio: clics suaves y crujido de vinilo durante la intro. Apagado por defecto. */

let AC: AudioContext | null = null;
let on = false;
let crk: { s: AudioBufferSourceNode; g: GainNode } | null = null;

function ctx() {
  if (!AC) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    AC = new C();
  }
  if (AC.state === "suspended") AC.resume();
  return AC;
}

export function tick(f: number, dur: number, vol: number) {
  if (!on) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * 0.55, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.03);
}

export function startCrackle() {
  if (!on || crk) return;
  const c = ctx();
  if (!c) return;
  const n = c.sampleRate * 6;
  const b = c.createBuffer(1, n, c.sampleRate);
  const d = b.getChannelData(0);
  let r = 0;
  for (let i = 0; i < n; i++) {
    r = r * 0.985 + (Math.random() - 0.5) * 0.02;
    d[i] = r * 0.5 + (Math.random() < 0.0007 ? (Math.random() * 2 - 1) * (0.4 + Math.random() * 0.6) : 0) * 0.8;
  }
  const s = c.createBufferSource();
  const hp = c.createBiquadFilter();
  const g = c.createGain();
  s.buffer = b;
  s.loop = true;
  hp.type = "highpass";
  hp.frequency.value = 500;
  g.gain.value = 0;
  s.connect(hp);
  hp.connect(g);
  g.connect(c.destination);
  s.start();
  g.gain.linearRampToValueAtTime(0.35, c.currentTime + 0.8);
  crk = { s, g };
}

export function stopCrackle() {
  if (!crk || !AC) return;
  const k = crk;
  crk = null;
  k.g.gain.cancelScheduledValues(AC.currentTime);
  k.g.gain.setValueAtTime(k.g.gain.value, AC.currentTime);
  k.g.gain.linearRampToValueAtTime(0, AC.currentTime + 0.7);
  setTimeout(() => {
    try {
      k.s.stop();
    } catch {}
  }, 900);
}

export function setSound(v: boolean) {
  on = v;
  if (v) ctx();
  else stopCrackle();
}
