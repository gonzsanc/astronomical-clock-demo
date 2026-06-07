<script lang="ts">
  import type { ClockState, InteractionAction, Season } from '../../domain/types';
  import ClockArtwork from './ClockArtwork.svelte';
  import ClockCeremonyOverlay from './ClockCeremonyOverlay.svelte';
  import ClockHands from './ClockHands.svelte';
  import ClockHitZones from './ClockHitZones.svelte';
  import ClockInteractionOverlay from './ClockInteractionOverlay.svelte';

  export let state: ClockState;
  export let showHitZones = false;
  export let onAction: (action: InteractionAction) => void;
  export let onSeason: (season: Season) => void;
</script>

<div class="clock-shell" data-testid="astronomical-clock">
  <ClockArtwork />
  <ClockInteractionOverlay {state} />
  <ClockHands reducedMotion={state.motionPreference === 'reduced'} />
  <ClockCeremonyOverlay {state} />
  <ClockHitZones {state} showDebug={showHitZones} {onAction} {onSeason} />
</div>
