// Synthesized Web Audio API sound engine (Zero external assets needed)

let audioCtx: AudioContext | null = null;
let isMuted = false;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

// Crisp cricket bat hitting ball (willow thwack)
export function playBatThwack(power: number = 1.0) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    // Resonant wooden pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);

    gain.gain.setValueAtTime(0.7 * power, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);

    // Punchy noise impact
    const bufferSize = ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.Q.setValueAtTime(2, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8 * power, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(t);
  } catch (e) {
    // Ignore audio errors if blocked by browser policy
  }
}

// Crowd roar cheer on 4s and 6s
export function playCrowdCheer() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    const duration = 1.8;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.linearRampToValueAtTime(1100, t + 0.5);
    filter.frequency.linearRampToValueAtTime(400, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.4);
    gain.gain.linearRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + duration);
  } catch (e) {}
}

// Stumps crashing rattle on Bowled / Wicket
export function playStumpsClatter() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    const freqs = [420, 680, 890, 1150];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq + Math.random() * 50, t + idx * 0.03);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.25);

      gain.gain.setValueAtTime(0.3, t + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + idx * 0.03);
      osc.stop(t + 0.25);
    });
  } catch (e) {}
}

// Win coins / rewarded ad chime
export function playCashChime() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch (e) {}
}
