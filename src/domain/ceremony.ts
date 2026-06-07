import type { MotionPreference } from './types';

export interface CeremonyStep {
  at: number;
  label: string;
}

export const ceremonySteps: CeremonyStep[] = [
  { at: 0, label: 'Preparación' },
  { at: 2_000, label: 'Encendido de anillos' },
  { at: 5_000, label: 'Engranajes sincronizados' },
  { at: 8_000, label: 'Día y noche' },
  { at: 11_000, label: 'Fase lunar' },
  { at: 14_000, label: 'Cuatro estaciones' },
  { at: 20_000, label: 'Constelaciones' },
  { at: 25_000, label: 'Proyección Armilar ceremonial' },
  { at: 29_000, label: 'Campana final' },
  { at: 31_000, label: 'Texto final' }
];

export function scaledCeremonySteps(motion: MotionPreference): CeremonyStep[] {
  if (motion === 'full') return ceremonySteps;
  const scale = 22_000 / 32_000;
  return ceremonySteps.map((step) => ({ ...step, at: Math.round(step.at * scale) }));
}
