import { describe, expect, it } from 'vitest';
import { ceremonyVisualPhase } from '../../src/domain/ceremony';
import { copy } from '../../src/domain/copy';
import { ceremonyDuration, projectionDuration, timings } from '../../src/domain/timings';
import { canDispatch, createInitialState, reduceClockState } from '../../src/domain/clockState';

describe('clock state machine', () => {
  it('moves from loading to initial rest with the first instruction', () => {
    const result = reduceClockState(createInitialState(), { action: 'ready' });

    expect(result.state.visualState).toBe('initialRest');
    expect(result.state.message).toBe(copy.initialInstruction);
    expect(result.state.isBusy).toBe(false);
  });

  it('activates the five closed modes from defined actions', () => {
    const ready = reduceClockState(createInitialState(), { action: 'ready' }).state;

    expect(reduceClockState(ready, { action: 'selectDayNight' }).state.mode).toBe('dayNight');
    expect(reduceClockState(ready, { action: 'advanceMoon' }).state.mode).toBe('moonPhase');
    expect(reduceClockState(ready, { action: 'selectSeason', season: 'winter' }).state.mode).toBe('seasons');
    expect(reduceClockState(ready, { action: 'toggleConstellations' }).state.mode).toBe('constellations');
    expect(reduceClockState(ready, { action: 'startCeremony' }).state.mode).toBe('ceremony');
  });

  it('blocks ambiguous interactions during projection and ceremony', () => {
    const ready = reduceClockState(createInitialState(), { action: 'ready' }).state;
    const projection = reduceClockState(ready, { action: 'activateRete' }).state;
    const ceremony = reduceClockState(ready, { action: 'startCeremony' }).state;

    expect(canDispatch(projection, 'activateRete')).toBe(false);
    expect(canDispatch(projection, 'toggleSound')).toBe(true);
    expect(canDispatch(ceremony, 'advanceMoon')).toBe(false);
    expect(canDispatch(ceremony, 'toggleSound')).toBe(true);
  });

  it('keeps specified full and reduced durations', () => {
    expect(projectionDuration('full')).toBe(8_000);
    expect(projectionDuration('reduced')).toBe(4_000);
    expect(ceremonyDuration('full')).toBe(32_000);
    expect(ceremonyDuration('reduced')).toBe(22_000);
    expect(timings.reset).toBe(2_200);
  });

  it('maps ceremony labels to stable visual phases', () => {
    expect(ceremonyVisualPhase('Preparacion')).toBe('opening');
    expect(ceremonyVisualPhase('Encendido de anillos')).toBe('rings');
    expect(ceremonyVisualPhase('Dia y noche')).toBe('solar');
    expect(ceremonyVisualPhase('Fase lunar')).toBe('moon');
    expect(ceremonyVisualPhase('Cuatro estaciones')).toBe('seasons');
    expect(ceremonyVisualPhase('Constelaciones')).toBe('stars');
    expect(ceremonyVisualPhase('Proyeccion Armilar ceremonial')).toBe('armillary');
    expect(ceremonyVisualPhase('Campana final')).toBe('bell');
    expect(ceremonyVisualPhase('Texto final')).toBe('final');
  });

  it('resets to origin through a controlled resetting state', () => {
    const ready = reduceClockState(createInitialState(), { action: 'ready' }).state;
    const changed = reduceClockState(ready, { action: 'advanceMoon' }).state;
    const result = reduceClockState(changed, { action: 'reset' });

    expect(result.effect).toBe('reset');
    expect(result.state.visualState).toBe('resetting');
    expect(result.state.message).toBe(copy.reset);
  });
});
