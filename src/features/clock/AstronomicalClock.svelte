<script lang="ts">
  import { moonPhaseLabels, tooltipCopy } from '../../domain/copy';
  import type { ClockState, DayPhase, InteractionAction, Season } from '../../domain/types';

  export let state: ClockState;
  export let onAction: (action: InteractionAction) => void;
  export let onSeason: (season: Season) => void;

  const seasons: Array<{ id: Season; label: string; x: number; y: number }> = [
    { id: 'spring', label: 'Primavera', x: 29, y: 70 },
    { id: 'summer', label: 'Verano', x: 41, y: 80 },
    { id: 'autumn', label: 'Otoño', x: 59, y: 80 },
    { id: 'winter', label: 'Invierno', x: 71, y: 70 }
  ];
  const seasonLabels: Record<Season, string> = {
    spring: 'Primavera',
    summer: 'Verano',
    autumn: 'Otoño',
    winter: 'Invierno'
  };

  $: moonLabel = `Fase lunar: ${moonPhaseLabels[state.moonPhase]}`;
  $: seasonLabel = seasonLabels[state.season];

  function handRotation(phase: DayPhase): number {
    const rotations: Record<DayPhase, number> = { dawn: -55, day: 35, dusk: 125, night: 215 };
    return rotations[phase];
  }
</script>

<div class="clock-shell" data-testid="astronomical-clock">
  <svg class="clock-svg" viewBox="0 0 600 600" role="img" aria-label="Reloj astronómico antiguo">
    <defs>
      <radialGradient id="dialGradient" cx="50%" cy="45%" r="62%">
        <stop offset="0%" stop-color="#243748" />
        <stop offset="58%" stop-color="#0e1823" />
        <stop offset="100%" stop-color="#05080d" />
      </radialGradient>
      <linearGradient id="brass" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#f4d48b" />
        <stop offset="42%" stop-color="#8b642b" />
        <stop offset="100%" stop-color="#33220f" />
      </linearGradient>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <circle class="outer-shadow" cx="300" cy="300" r="270" />
    <circle class="outer-frame" cx="300" cy="300" r="252" />
    <circle class="hour-ring" cx="300" cy="300" r="214" />
    <circle class="zodiac-ring" cx="300" cy="300" r="176" />
    <circle class="dial" cx="300" cy="300" r="145" />

    <g class="roman-hours">
      <text x="300" y="110">XII</text>
      <text x="493" y="306">III</text>
      <text x="300" y="500">VI</text>
      <text x="100" y="306">IX</text>
    </g>

    <g class="zodiac-marks">
      {#each Array(12) as _, index}
        <line
          x1="300"
          y1="129"
          x2="300"
          y2="149"
          transform={`rotate(${index * 30} 300 300)`}
        />
      {/each}
    </g>

    <g class="constellation-lines">
      <path d="M214 228 L255 198 L298 220 L340 185 L389 218" />
      <path d="M184 360 L235 333 L287 353 L345 326 L410 360" />
      <path d="M236 272 L284 248 L334 278 L378 252" />
    </g>

    <g class="rete">
      <circle cx="300" cy="300" r="164" />
      {#each Array(16) as _, index}
        <path d="M300 145 L306 172 L294 172 Z" transform={`rotate(${index * 22.5} 300 300)`} />
      {/each}
      <circle cx="218" cy="205" r="4" />
      <circle cx="383" cy="196" r="4" />
      <circle cx="420" cy="384" r="4" />
    </g>

    <g class="moon-window">
      <circle cx="380" cy="390" r="42" />
      <circle class={`moon-disc moon-${state.moonPhase}`} cx="380" cy="390" r="29" />
    </g>

    <g class="season-medallion">
      <circle cx="220" cy="392" r="42" />
      <text x="220" y="398">{seasonLabel}</text>
    </g>

    <g class="hands" transform={`rotate(${handRotation(state.dayPhase)} 300 300)`}>
      <line x1="300" y1="300" x2="300" y2="155" />
      <circle cx="300" cy="300" r="12" />
    </g>

    <g class="bell">
      <circle cx="300" cy="300" r="44" />
      <circle cx="300" cy="300" r="18" />
    </g>

    <circle class="glass" cx="300" cy="300" r="232" />
  </svg>

  <button
    class="clock-zone zone-hours"
    type="button"
    aria-label="Activar modo Día y noche"
    title="El día gira sobre el mismo eje"
    data-testid="control-day-night"
    onclick={() => onAction('selectDayNight')}
  ></button>

  <button
    class="clock-zone zone-moon"
    type="button"
    aria-label={moonLabel}
    title={tooltipCopy.moon}
    data-testid="control-moon"
    onclick={() => onAction('advanceMoon')}
  ></button>

  {#each seasons as season}
    <button
      class={`clock-zone zone-season season-${season.id}`}
      class:active-season={state.season === season.id}
      type="button"
      aria-label={`Activar estación ${season.label}`}
      title={tooltipCopy.seasons}
      style={`left:${season.x}%; top:${season.y}%`}
      data-testid={`control-season-${season.id}`}
      onclick={() => onSeason(season.id)}
    ></button>
  {/each}

  <button
    class="clock-zone zone-stars"
    type="button"
    aria-label="Activar constelaciones"
    title={tooltipCopy.constellations}
    data-testid="control-constellations"
    onclick={() => onAction('toggleConstellations')}
  ></button>

  <button
    class="clock-zone zone-rete"
    type="button"
    aria-label="Activar Rete Celeste"
    title={tooltipCopy.rete}
    data-testid="control-rete"
    onclick={() => onAction('activateRete')}
  ></button>

  <button
    class="clock-zone zone-bell"
    type="button"
    aria-label={tooltipCopy.bell}
    title={tooltipCopy.bell}
    data-testid="control-ceremony"
    onclick={() => onAction('startCeremony')}
  ></button>
</div>
