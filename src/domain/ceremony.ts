import type { MotionPreference } from './types';

export interface CeremonyStep {
  at: number;
  label: string;
}

export type CeremonyVisualPhase =
  | 'opening'
  | 'rings'
  | 'solar'
  | 'moon'
  | 'seasons'
  | 'stars'
  | 'armillary'
  | 'bell'
  | 'final';

export const ceremonySteps: CeremonyStep[] = [
  { at: 0, label: 'Preparacion' },
  { at: 2_000, label: 'Encendido de anillos' },
  { at: 5_000, label: 'Engranajes sincronizados' },
  { at: 8_000, label: 'Dia y noche' },
  { at: 11_000, label: 'Fase lunar' },
  { at: 14_000, label: 'Cuatro estaciones' },
  { at: 20_000, label: 'Constelaciones' },
  { at: 25_000, label: 'Proyeccion Armilar ceremonial' },
  { at: 29_000, label: 'Campana final' },
  { at: 31_000, label: 'Texto final' }
];

export function scaledCeremonySteps(motion: MotionPreference): CeremonyStep[] {
  if (motion === 'full') return ceremonySteps;
  const scale = 22_000 / 32_000;
  return ceremonySteps.map((step) => ({ ...step, at: Math.round(step.at * scale) }));
}

export function ceremonyVisualPhase(step: string): CeremonyVisualPhase {
  const value = step.toLowerCase();

  if (value.includes('texto')) return 'final';
  if (value.includes('campana')) return 'bell';
  if (value.includes('armilar') || value.includes('proyeccion')) return 'armillary';
  if (value.includes('constelaciones')) return 'stars';
  if (value.includes('estaciones')) return 'seasons';
  if (value.includes('lunar')) return 'moon';
  if (value.includes('dia') || value.includes('noche')) return 'solar';
  if (value.includes('anillos') || value.includes('engranajes')) return 'rings';

  return 'opening';
}
