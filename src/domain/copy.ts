import type { ClockMode } from './types';

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
  help: 'Toca los anillos, las ventanas y la campana. Cada pieza tiene una respuesta cerrada.',
  resourceError: 'El mecanismo no ha cargado completo. Recarga la experiencia.'
} as const;

export const panelCopy: Record<ClockMode, string> = {
  idle: copy.help,
  dayNight: 'Gira la aguja para ver cómo el reloj traduce las horas en luz, sombra y temperatura.',
  moonPhase: 'La ventana lunar muestra un ciclo lento, integrado en el mecanismo como una complicación de relojería.',
  seasons: 'Cada estación modifica el metal, el aire y los pequeños signos del año.',
  constellations: 'La Rete Celeste guarda una lectura plana del cielo. Al tocarla, el instrumento despliega su cúpula oculta.',
  ceremony: 'La ceremonia sincroniza anillos, luna, estaciones, constelaciones y campana final.',
  final: copy.ceremonyFinal
};

export const tooltipCopy = {
  sun: 'La luz ordena el día.',
  moon: copy.moon,
  seasons: copy.seasons,
  constellations: copy.constellations,
  rete: copy.rete,
  bell: copy.ceremonyAction
} as const;
