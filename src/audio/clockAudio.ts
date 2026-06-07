import type { InteractionAction, SoundState } from '../domain/types';

const toneMap: Partial<Record<InteractionAction, number>> = {
  selectDayNight: 220,
  advanceMoon: 330,
  selectSeason: 260,
  toggleConstellations: 440,
  activateRete: 560,
  startCeremony: 196,
  reset: 300
};

export function playClockSound(action: InteractionAction, soundState: SoundState): void {
  if (soundState !== 'enabled') return;
  const frequency = toneMap[action];
  if (!frequency) return;

  const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextCtor) return;

  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = action === 'startCeremony' ? 'sine' : 'triangle';
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.45);
  oscillator.addEventListener('ended', () => void context.close());
}
