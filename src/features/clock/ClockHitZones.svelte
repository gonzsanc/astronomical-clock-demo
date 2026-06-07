<script lang="ts">
  import { moonPhaseLabels } from '../../domain/copy';
  import type { ClockState, InteractionAction, Season } from '../../domain/types';
  import {
    leadingActionHitZones,
    seasonHitZones,
    trailingActionHitZones,
    type ActionHitZone,
    type HitZone
  } from './clockHitZones';

  export let state: ClockState;
  export let showDebug = false;
  export let onAction: (action: InteractionAction) => void;
  export let onSeason: (season: Season) => void;

  function dispatchZone(zone: ActionHitZone): void {
    onAction(zone.action === 'bellAction' ? bellAction : zone.action);
  }

  function zoneStyle(zone: HitZone): string {
    const width = zone.shape === 'ellipse' ? zone.rx * 2 : zone.r * 2;
    const height = zone.shape === 'ellipse' ? zone.ry * 2 : zone.r * 2;
    return `left:${zone.cx / 10}%;top:${zone.cy / 10}%;width:${width / 10}%;height:${height / 10}%`;
  }

  $: bellAction = (state.visualState === 'final' ? 'reset' : 'startCeremony') as InteractionAction;
  $: bellLabel = state.visualState === 'final' ? 'Reiniciar mecanismo' : 'Iniciar la ceremonia del tiempo.';
</script>

<div
  class:debug={showDebug}
  class="clock-hit-zones"
  aria-label="Zonas interactivas del reloj"
  data-testid="clock-hit-zones"
  data-debug={showDebug}
>
  {#each leadingActionHitZones as zone}
    <button
      class="clock-hit-zone"
      class:reset-ready={zone.zone === 'bell' && state.visualState === 'final'}
      type="button"
      aria-label={zone.zone === 'moon' ? `Fase lunar: ${moonPhaseLabels[state.moonPhase]}` : zone.zone === 'bell' ? bellLabel : zone.label}
      title={zone.zone === 'bell' ? bellLabel : zone.title}
      style={zoneStyle(zone)}
      data-testid={zone.testId}
      data-zone={zone.zone}
      onclick={() => dispatchZone(zone)}
    ></button>
  {/each}

  {#each seasonHitZones as zone}
    <button
      class="clock-hit-zone"
      class:active-zone={state.season === zone.season}
      type="button"
      aria-label={zone.label}
      title={zone.title}
      style={zoneStyle(zone)}
      data-testid={zone.testId}
      data-zone={zone.zone}
      onclick={() => onSeason(zone.season)}
    ></button>
  {/each}

  {#each trailingActionHitZones as zone}
    <button
      class="clock-hit-zone"
      class:reset-ready={zone.zone === 'bell' && state.visualState === 'final'}
      type="button"
      aria-label={zone.zone === 'bell' ? bellLabel : zone.label}
      title={zone.zone === 'bell' ? bellLabel : zone.title}
      style={zoneStyle(zone)}
      data-testid={zone.testId}
      data-zone={zone.zone}
      onclick={() => dispatchZone(zone)}
    ></button>
  {/each}
</div>
