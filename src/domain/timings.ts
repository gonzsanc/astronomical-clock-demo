import type { MotionPreference } from './types';

export const timings = {
  loading: 900,
  dayNight: 2_500,
  moon: 1_200,
  season: 3_000,
  constellations: 2_000,
  reteProjection: 8_000,
  reducedReteProjection: 4_000,
  ceremony: 32_000,
  reducedCeremony: 22_000,
  reset: 2_200
} as const;

export function projectionDuration(motion: MotionPreference): number {
  return motion === 'reduced' ? timings.reducedReteProjection : timings.reteProjection;
}

export function ceremonyDuration(motion: MotionPreference): number {
  return motion === 'reduced' ? timings.reducedCeremony : timings.ceremony;
}
