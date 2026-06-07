import { copy } from './copy';
import type { ClockCommand, ClockState, MoonPhase, TransitionResult } from './types';

const moonSequence: MoonPhase[] = ['new', 'waxing', 'firstQuarter', 'gibbous', 'full', 'waning'];

export function createInitialState(): ClockState {
  return {
    mode: 'idle',
    visualState: 'loading',
    previousMode: 'idle',
    dayPhase: 'dawn',
    moonPhase: 'firstQuarter',
    season: 'spring',
    soundState: 'muted',
    motionPreference: 'full',
    message: copy.loading,
    ceremonyStep: '',
    isBusy: true
  };
}

export function canDispatch(state: ClockState, action: ClockCommand['action']): boolean {
  if (action === 'toggleSound' || action === 'setMotion') return true;
  if (state.visualState === 'loading') return action === 'ready';
  if (state.visualState === 'ceremony') return false;
  if (state.visualState === 'armillaryProjection') return false;
  if (state.visualState === 'resetting') return false;
  if (state.visualState === 'seasonTransition') return action !== 'selectSeason';
  return true;
}

export function reduceClockState(state: ClockState, command: ClockCommand): TransitionResult {
  if (!canDispatch(state, command.action)) return { state };

  switch (command.action) {
    case 'ready':
      return { state: { ...state, visualState: 'initialRest', isBusy: false, message: copy.initialInstruction } };
    case 'selectDayNight':
      return { state: nextMode(state, 'dayNight', { message: copy.dayNight, dayPhase: nextDayPhase(state.dayPhase) }) };
    case 'advanceMoon':
      return { state: nextMode(state, 'moonPhase', { message: copy.moon, moonPhase: nextMoonPhase(state.moonPhase) }) };
    case 'selectSeason':
      return {
        state: nextMode(state, 'seasons', {
          visualState: 'seasonTransition',
          isBusy: true,
          message: copy.seasons,
          season: command.season ?? 'spring'
        }),
        effect: 'season'
      };
    case 'toggleConstellations':
      return { state: nextMode(state, 'constellations', { message: copy.constellations }) };
    case 'activateRete':
      return { state: startProjection(state), effect: 'projection' };
    case 'startCeremony':
      return { state: startCeremony(state), effect: 'ceremony' };
    case 'toggleSound':
      return { state: { ...state, soundState: state.soundState === 'muted' ? 'enabled' : 'muted' }, effect: 'sound' };
    case 'setMotion':
      return { state: { ...state, motionPreference: command.motionPreference ?? state.motionPreference } };
    case 'reset':
      return { state: { ...createInitialState(), visualState: 'resetting', isBusy: true, message: copy.reset }, effect: 'reset' };
  }
}

function nextMode(state: ClockState, mode: ClockState['mode'], patch: Partial<ClockState>): ClockState {
  return { ...state, mode, visualState: patch.visualState ?? 'exploration', isBusy: patch.isBusy ?? false, ...patch };
}

function startProjection(state: ClockState): ClockState {
  return { ...state, previousMode: state.mode, mode: 'constellations', visualState: 'armillaryProjection', isBusy: true, message: copy.rete };
}

function startCeremony(state: ClockState): ClockState {
  return { ...state, mode: 'ceremony', visualState: 'ceremony', isBusy: true, message: copy.ceremonyFinal };
}

function nextDayPhase(current: ClockState['dayPhase']): ClockState['dayPhase'] {
  const sequence: ClockState['dayPhase'][] = ['dawn', 'day', 'dusk', 'night'];
  return sequence[(sequence.indexOf(current) + 1) % sequence.length];
}

function nextMoonPhase(current: MoonPhase): MoonPhase {
  return moonSequence[(moonSequence.indexOf(current) + 1) % moonSequence.length];
}
