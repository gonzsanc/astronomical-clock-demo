import { tooltipCopy } from '../../domain/copy';
import type { InteractionAction, Season } from '../../domain/types';

export interface BaseHitZone {
  testId: string;
  zone: string;
  label: string;
  title: string;
  cx: number;
  cy: number;
}

export interface EllipseHitZone extends BaseHitZone {
  shape: 'ellipse';
  rx: number;
  ry: number;
}

export interface CircleHitZone extends BaseHitZone {
  shape: 'circle';
  r: number;
}

export type HitZone = EllipseHitZone | CircleHitZone;

export type ActionHitZone = HitZone & {
  action: InteractionAction | 'bellAction';
};

export interface SeasonHitZone extends CircleHitZone {
  season: Season;
}

export const actionHitZones: ActionHitZone[] = [
  {
    shape: 'ellipse',
    testId: 'control-day-night',
    zone: 'hours',
    label: 'Activar modo Dia y noche',
    title: 'El dia gira sobre el mismo eje',
    action: 'selectDayNight',
    cx: 500,
    cy: 218,
    rx: 270,
    ry: 88
  },
  {
    shape: 'circle',
    testId: 'control-moon',
    zone: 'moon',
    label: 'Fase lunar',
    title: tooltipCopy.moon,
    action: 'advanceMoon',
    cx: 705,
    cy: 710,
    r: 86
  },
  {
    shape: 'ellipse',
    testId: 'control-constellations',
    zone: 'constellations',
    label: 'Activar constelaciones',
    title: tooltipCopy.constellations,
    action: 'toggleConstellations',
    cx: 500,
    cy: 405,
    rx: 210,
    ry: 160
  },
  {
    shape: 'ellipse',
    testId: 'control-rete',
    zone: 'rete',
    label: 'Activar Rete Celeste',
    title: tooltipCopy.rete,
    action: 'activateRete',
    cx: 630,
    cy: 500,
    rx: 96,
    ry: 112
  },
  {
    shape: 'circle',
    testId: 'control-ceremony',
    zone: 'bell',
    label: 'Iniciar ceremonia',
    title: tooltipCopy.bell,
    action: 'bellAction',
    cx: 500,
    cy: 500,
    r: 70
  }
];

export const leadingActionHitZones = actionHitZones.slice(0, 2);
export const trailingActionHitZones = actionHitZones.slice(2);

export const seasonHitZones: SeasonHitZone[] = [
  seasonZone('spring', 'Primavera', 286, 670),
  seasonZone('summer', 'Verano', 344, 670),
  seasonZone('autumn', 'Otono', 344, 736),
  seasonZone('winter', 'Invierno', 286, 736)
];

function seasonZone(season: Season, label: string, cx: number, cy: number): SeasonHitZone {
  return {
    shape: 'circle',
    season,
    testId: `control-season-${season}`,
    zone: `season-${season}`,
    label: `Activar estacion ${label}`,
    title: tooltipCopy.seasons,
    cx,
    cy,
    r: 42
  };
}
