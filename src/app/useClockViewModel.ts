import { copy } from '../domain/copy';
import { scaledCeremonySteps } from '../domain/ceremony';
import { createInitialState, reduceClockState } from '../domain/clockState';
import { ceremonyDuration, projectionDuration, timings } from '../domain/timings';
import type { ClockCommand, ClockState } from '../domain/types';

type Listener = (state: ClockState) => void;

export interface ClockViewModel {
  getState: () => ClockState;
  subscribe: (listener: Listener) => () => void;
  dispatch: (command: ClockCommand) => void;
  dispose: () => void;
}

export function createClockViewModel(speed = 1): ClockViewModel {
  let state = createInitialState();
  const listeners = new Set<Listener>();
  const timers: number[] = [];

  function setState(next: ClockState): void {
    state = next;
    listeners.forEach((listener) => listener(state));
  }

  function schedule(callback: () => void, delay: number): void {
    timers.push(window.setTimeout(callback, Math.max(1, delay * speed)));
  }

  function dispatch(command: ClockCommand): void {
    const result = reduceClockState(state, command);
    if (result.state === state && !result.effect) return;
    setState(result.state);
    if (result.effect === 'projection') finishProjection();
    if (result.effect === 'season') finishSeason();
    if (result.effect === 'ceremony') runCeremony();
    if (result.effect === 'reset') finishReset();
  }

  function finishProjection(): void {
    const duration = projectionDuration(state.motionPreference);
    schedule(() => {
      setState({
        ...state,
        mode: state.previousMode === 'idle' ? 'constellations' : state.previousMode,
        visualState: 'exploration',
        isBusy: false,
        message: copy.constellations
      });
    }, duration);
  }

  function finishSeason(): void {
    schedule(() => {
      setState({ ...state, visualState: 'exploration', isBusy: false });
    }, timings.season);
  }

  function runCeremony(): void {
    const steps = scaledCeremonySteps(state.motionPreference);
    steps.forEach((step) => {
      schedule(() => setState({ ...state, ceremonyStep: step.label }), step.at);
    });
    schedule(() => {
      setState({
        ...state,
        mode: 'final',
        visualState: 'final',
        isBusy: false,
        ceremonyStep: 'Reposo nocturno',
        message: copy.ceremonyFinal
      });
    }, ceremonyDuration(state.motionPreference));
  }

  function finishReset(): void {
    schedule(() => {
      setState({
        ...createInitialState(),
        visualState: 'initialRest',
        isBusy: false,
        message: copy.initialInstruction
      });
    }, timings.reset);
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    dispatch,
    dispose() {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.length = 0;
      listeners.clear();
    }
  };
}

export function resolveDemoSpeed(location: Location): number {
  return new URLSearchParams(location.search).get('demoSpeed') === 'fast' ? 0.04 : 1;
}
