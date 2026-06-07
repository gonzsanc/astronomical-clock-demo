import type { MoonPhase } from './types';

export const copy = {
  title: 'Reloj Astronómico Interactivo',
  subtitle: 'Un instrumento para leer el tiempo humano y el tiempo celeste.',
  initialInstruction: 'Toca el anillo del tiempo.',
  loading: 'Preparando el mecanismo.',
  dayNight: 'El día gira sobre el mismo eje.',
  moon: 'La luna avanza sin prisa.',
  seasons: 'El año respira en cuatro movimientos.',
  constellations: 'Las estrellas encuentran su trazo.',
  rete: 'La esfera oculta del cielo.',
  ceremonyAction: 'Iniciar la ceremonia del tiempo.',
  ceremonyFinal: 'El tiempo no pasa. Se revela.',
  reset: 'El mecanismo vuelve al origen.',
  resourceError: 'El mecanismo no ha cargado completo. Recarga la experiencia.'
} as const;

export const moonPhaseLabels: Record<MoonPhase, string> = {
  new: 'Luna nueva',
  waxing: 'Luna creciente',
  firstQuarter: 'Cuarto creciente',
  gibbous: 'Luna gibosa',
  full: 'Luna llena',
  waning: 'Luna menguante'
};

export const tooltipCopy = {
  sun: 'La luz ordena el día.',
  moon: copy.moon,
  seasons: copy.seasons,
  constellations: copy.constellations,
  rete: copy.rete,
  bell: copy.ceremonyAction
} as const;
