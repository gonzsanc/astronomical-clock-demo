<script lang="ts">
  import type { ClockState, DayPhase, MoonPhase, Season } from '../../domain/types';

  export let state: ClockState;

  const dayNodes: Array<{ id: DayPhase; cx: number; cy: number }> = [
    { id: 'dawn', cx: 288, cy: 304 },
    { id: 'day', cx: 500, cy: 214 },
    { id: 'dusk', cx: 712, cy: 304 },
    { id: 'night', cx: 500, cy: 790 }
  ];

  const seasonNodes: Array<{ id: Season; cx: number; cy: number; mark: string }> = [
    { id: 'spring', cx: 280, cy: 660, mark: 'M0 16 C-12 2 -6 -14 12 -18 C8 -4 4 8 0 16' },
    { id: 'summer', cx: 360, cy: 660, mark: 'M0 -20 L6 -6 L21 0 L6 6 L0 20 L-6 6 L-21 0 L-6 -6 Z' },
    { id: 'autumn', cx: 360, cy: 740, mark: 'M-16 -3 C-4 -18 18 -14 14 5 C8 18 -8 14 -16 -3' },
    { id: 'winter', cx: 280, cy: 740, mark: 'M0 -21 V21 M-18 -10 L18 10 M18 -10 L-18 10' }
  ];

  const starPoints = [
    [372, 394],
    [430, 354],
    [488, 386],
    [552, 334],
    [621, 386],
    [363, 513],
    [426, 480],
    [478, 526],
    [542, 492],
    [620, 536],
    [486, 584],
    [558, 610],
    [630, 570]
  ] as const;

  const moonMasks: Record<MoonPhase, { cx: number; rx: number; opacity: number }> = {
    new: { cx: 688, rx: 48, opacity: 0.86 },
    waxing: { cx: 710, rx: 38, opacity: 0.66 },
    firstQuarter: { cx: 732, rx: 48, opacity: 0.58 },
    gibbous: { cx: 754, rx: 54, opacity: 0.38 },
    full: { cx: 728, rx: 10, opacity: 0 },
    waning: { cx: 664, rx: 38, opacity: 0.62 }
  };

  $: moonMask = moonMasks[state.moonPhase];
</script>

<svg
  class={`clock-overlay mode-${state.mode} visual-${state.visualState} phase-${state.dayPhase} season-${state.season}`}
  viewBox="0 0 1000 1000"
  aria-hidden="true"
  data-testid="interaction-overlay"
  data-active-mode={state.mode}
  data-visual-state={state.visualState}
  data-day-phase={state.dayPhase}
  data-moon-phase={state.moonPhase}
  data-season={state.season}
>
  <defs>
    <filter id="overlayGlow" x="-18%" y="-18%" width="136%" height="136%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <radialGradient id="moonLight" cx="38%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fff8d4" />
      <stop offset="56%" stop-color="#d5e7ee" />
      <stop offset="100%" stop-color="#42515b" />
    </radialGradient>
  </defs>

  <g class="day-layer">
    <path class="overlay-line solar-arc draw-path" d="M238 509 C312 312 690 312 762 509" />
    <path class="overlay-line horizon-line draw-path" d="M236 509 C345 566 655 566 764 509" />
    <line class="overlay-line solar-meridian" x1="500" x2="500" y1="218" y2="782" />
    {#each dayNodes as node}
      <circle
        class:active={state.dayPhase === node.id}
        class="day-node"
        cx={node.cx}
        cy={node.cy}
        r="13"
      />
    {/each}
  </g>

  <g class="moon-layer">
    <circle class="moon-halo" cx="692" cy="700" r="72" />
    <circle class="moon-disc" cx="692" cy="700" r="48" />
    <ellipse
      class="moon-shadow"
      cx={moonMask.cx}
      cy="700"
      rx={moonMask.rx}
      ry="49"
      opacity={moonMask.opacity}
    />
    <path class="overlay-line moon-orbit draw-path" d="M610 700 A82 82 0 1 0 774 700 A82 82 0 1 0 610 700" />
  </g>

  <g class="season-layer">
    {#each seasonNodes as node}
      <g
        class:active={state.season === node.id}
        class={`season-marker season-${node.id}`}
        transform={`translate(${node.cx} ${node.cy})`}
      >
        <circle r="37" />
        <path d={node.mark} />
      </g>
    {/each}
    <path class="overlay-line season-thread draw-path" d="M280 660 C322 620 365 625 360 660 C400 700 398 739 360 740 C318 780 275 774 280 740 C240 700 242 660 280 660" />
  </g>

  <g class="constellation-layer">
    <path class="overlay-line star-line draw-path" d="M372 394 L430 354 L488 386 L552 334 L621 386" />
    <path class="overlay-line star-line draw-path delayed" d="M363 513 L426 480 L478 526 L542 492 L620 536" />
    <path class="overlay-line star-line draw-path late" d="M426 620 L486 584 L558 610 L630 570" />
    {#each starPoints as point}
      <circle class="star-point" cx={point[0]} cy={point[1]} r="4.5" />
    {/each}
  </g>

  <g class="rete-layer">
    <ellipse class="overlay-ring outer-armillary draw-path" cx="500" cy="500" rx="560" ry="168" />
    <ellipse class="overlay-ring outer-armillary draw-path delayed" cx="500" cy="500" rx="520" ry="214" transform="rotate(31 500 500)" />
    <ellipse class="overlay-ring outer-armillary draw-path late" cx="500" cy="500" rx="520" ry="214" transform="rotate(-34 500 500)" />
    <circle class="overlay-ring rete-ring" cx="500" cy="500" r="225" />
    <path class="overlay-line rete-ecliptic draw-path" d="M284 555 C368 396 594 348 718 455 C642 620 402 666 284 555" />
    <path class="overlay-line rete-spine draw-path delayed" d="M334 431 L500 500 L676 432 M395 648 L500 500 L603 648" />
    <circle class="rete-star sirio" cx="676" cy="432" r="8" />
    <circle class="rete-star vega" cx="500" cy="312" r="8" />
    <circle class="rete-star antares" cx="395" cy="648" r="8" />
  </g>

  <g class="reset-layer">
    <circle class="reset-ring" cx="500" cy="500" r="255" />
    <path class="overlay-line reset-cross" d="M358 500 H642 M500 358 V642" />
  </g>
</svg>
