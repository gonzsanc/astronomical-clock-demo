<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { playClockSound } from '../audio/clockAudio';
  import { ceremonyVisualPhase } from '../domain/ceremony';
  import { copy } from '../domain/copy';
  import { createInitialState } from '../domain/clockState';
  import { timings } from '../domain/timings';
  import type { ClockState, InteractionAction, Season } from '../domain/types';
  import ArmillaryProjection from '../features/rete-celeste/ArmillaryProjection.svelte';
  import AstronomicalClock from '../features/clock/AstronomicalClock.svelte';
  import { createClockViewModel, resolveDemoSpeed, type ClockViewModel } from './useClockViewModel';

  let state: ClockState = createInitialState();
  let viewModel: ClockViewModel | undefined;
  let cleanup = () => {};
  let loadingTimer = 0;
  let showHitZones = false;

  onMount(() => {
    const speed = resolveDemoSpeed(window.location);
    const params = new URLSearchParams(window.location.search);
    showHitZones = params.has('hitZones') || params.has('debugHitZones');
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

  $: showFinalInscription = state.visualState === 'final';
  $: ceremonyProjectionActive =
    state.visualState === 'ceremony' && ceremonyVisualPhase(state.ceremonyStep) === 'armillary';
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

    <div class="clock-placement">
      <AstronomicalClock
        {state}
        {showHitZones}
        onAction={act}
        onSeason={selectSeason}
      />

      {#if state.visualState === 'armillaryProjection' || state.visualState === 'ceremony'}
        <ArmillaryProjection
          active={state.visualState === 'armillaryProjection' || ceremonyProjectionActive}
          reducedMotion={state.motionPreference === 'reduced'}
        />
      {/if}
    </div>

    <p class="sr-only" aria-live="polite">{state.message}</p>
    {#if showFinalInscription}
      <p class="final-inscription" data-testid="final-inscription">{copy.ceremonyFinal}</p>
    {/if}
  </section>
</main>
