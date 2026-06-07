<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { playClockSound } from '../audio/clockAudio';
  import { copy, modeLabels, panelCopy } from '../domain/copy';
  import { createInitialState } from '../domain/clockState';
  import { timings } from '../domain/timings';
  import type { ClockState, InteractionAction, Season } from '../domain/types';
  import ArmillaryProjection from '../features/rete-celeste/ArmillaryProjection.svelte';
  import AstronomicalClock from '../features/clock/AstronomicalClock.svelte';
  import ControlDock from '../ui/ControlDock.svelte';
  import SidePanel from '../ui/SidePanel.svelte';
  import { createClockViewModel, resolveDemoSpeed, type ClockViewModel } from './useClockViewModel';

  let state: ClockState = createInitialState();
  let viewModel: ClockViewModel | undefined;
  let cleanup = () => {};
  let loadingTimer = 0;

  onMount(() => {
    const speed = resolveDemoSpeed(window.location);
    viewModel = createClockViewModel(speed);
    cleanup = viewModel.subscribe((next) => (state = next));
    loadingTimer = window.setTimeout(() => act('ready'), timings.loading * speed);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      viewModel.dispatch({ action: 'setMotion', motionPreference: 'reduced' });
    }

    return () => {
      window.clearTimeout(loadingTimer);
      cleanup();
      viewModel?.dispose();
    };
  });

  onDestroy(() => {
    window.clearTimeout(loadingTimer);
    cleanup();
    viewModel?.dispose();
  });

  function act(action: InteractionAction): void {
    if (!viewModel) return;
    const currentSound = viewModel.getState().soundState;
    viewModel.dispatch({ action });
    playClockSound(action, currentSound);
  }

  function selectSeason(season: Season): void {
    if (!viewModel) return;
    const currentSound = viewModel.getState().soundState;
    viewModel.dispatch({ action: 'selectSeason', season });
    playClockSound('selectSeason', currentSound);
  }

  function toggleMotion(): void {
    if (!viewModel) return;
    const motionPreference = state.motionPreference === 'full' ? 'reduced' : 'full';
    viewModel.dispatch({ action: 'setMotion', motionPreference });
  }

  $: panelText = panelCopy[state.mode];
</script>

<svelte:head>
  <title>{copy.title}</title>
</svelte:head>

<main
  class={`experience mode-${state.mode} visual-${state.visualState} phase-${state.dayPhase} season-${state.season}`}
  data-testid="app-root"
  data-motion={state.motionPreference}
>
  <section class="stage" aria-label="Reloj Astronómico Interactivo">
    <div class="intro" aria-live="polite">
      <h1>{copy.title}</h1>
      <p>{copy.subtitle}</p>
    </div>

    {#if state.visualState === 'loading'}
      <div class="loader" data-testid="loader">
        <span></span>
        <p>{state.message}</p>
      </div>
    {/if}

    <AstronomicalClock
      {state}
      onAction={act}
      onSeason={selectSeason}
    />

    {#if state.visualState === 'armillaryProjection' || state.visualState === 'ceremony'}
      <ArmillaryProjection
        active={state.visualState === 'armillaryProjection' || state.ceremonyStep.includes('Proyección')}
        reducedMotion={state.motionPreference === 'reduced'}
      />
    {/if}

    <p class="status-line" data-testid="status-line">{state.message}</p>
    {#if state.ceremonyStep}
      <p class="ceremony-step" data-testid="ceremony-step">{state.ceremonyStep}</p>
    {/if}
  </section>

  <SidePanel
    open={state.panelOpen}
    title={modeLabels[state.mode]}
    text={panelText}
    onClose={() => act('closePanel')}
  />

  <ControlDock
    soundState={state.soundState}
    motionPreference={state.motionPreference}
    finalState={state.visualState === 'final'}
    onHelp={() => act('openPanel')}
    onSound={() => act('toggleSound')}
    onMotion={toggleMotion}
    onReset={() => act('reset')}
  />
</main>
