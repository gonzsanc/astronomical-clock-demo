export type ClockMode =
  | 'idle'
  | 'dayNight'
  | 'moonPhase'
  | 'seasons'
  | 'constellations'
  | 'ceremony'
  | 'final';

export type VisualState =
  | 'loading'
  | 'initialRest'
  | 'exploration'
  | 'armillaryProjection'
  | 'seasonTransition'
  | 'ceremony'
  | 'final'
  | 'resetting'
  | 'resourceError';

export type InteractionAction =
  | 'ready'
  | 'selectDayNight'
  | 'advanceMoon'
  | 'selectSeason'
  | 'toggleConstellations'
  | 'activateRete'
  | 'startCeremony'
  | 'openPanel'
  | 'closePanel'
  | 'toggleSound'
  | 'setMotion'
  | 'reset';

export type MotionPreference = 'full' | 'reduced';
export type SoundState = 'muted' | 'enabled';
export type DayPhase = 'dawn' | 'day' | 'dusk' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type MoonPhase =
  | 'new'
  | 'waxing'
  | 'firstQuarter'
  | 'gibbous'
  | 'full'
  | 'waning';

export interface ClockState {
  mode: ClockMode;
  visualState: VisualState;
  previousMode: ClockMode;
  dayPhase: DayPhase;
  moonPhase: MoonPhase;
  season: Season;
  panelOpen: boolean;
  soundState: SoundState;
  motionPreference: MotionPreference;
  message: string;
  ceremonyStep: string;
  isBusy: boolean;
}

export interface ClockCommand {
  action: InteractionAction;
  season?: Season;
  motionPreference?: MotionPreference;
}

export interface TransitionResult {
  state: ClockState;
  effect?: 'projection' | 'season' | 'ceremony' | 'reset' | 'sound';
}
