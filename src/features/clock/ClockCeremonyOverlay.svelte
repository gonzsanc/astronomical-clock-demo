<script lang="ts">
  import { ceremonyVisualPhase } from '../../domain/ceremony';
  import type { ClockState } from '../../domain/types';

  export let state: ClockState;

  $: visible = state.visualState === 'ceremony' || state.visualState === 'final';
  $: phase = state.visualState === 'final' ? 'final' : ceremonyVisualPhase(state.ceremonyStep);
</script>

<svg
  class={`clock-ceremony-overlay phase-${phase}`}
  class:visible
  viewBox="0 0 1000 1000"
  aria-hidden="true"
  data-testid="ceremony-overlay"
  data-ceremony-phase={phase}
>
  <defs>
    <filter id="ceremonyGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="ceremonyGold" x1="35%" x2="65%" y1="16%" y2="84%">
      <stop offset="0%" stop-color="#fff1b8" />
      <stop offset="52%" stop-color="#d8a84f" />
      <stop offset="100%" stop-color="#8f5f2c" />
    </linearGradient>
  </defs>

  <g class="ceremony-frame">
    <circle class="ceremony-sweep sweep-outer" cx="500" cy="500" r="440" />
    <circle class="ceremony-sweep sweep-inner" cx="500" cy="500" r="332" />
  </g>

  <g class="ceremony-rings">
    <circle class="ceremony-orbit orbit-equator" cx="500" cy="500" r="286" />
    <ellipse class="ceremony-orbit orbit-ecliptic" cx="500" cy="500" rx="326" ry="106" transform="rotate(-24 500 500)" />
    <ellipse class="ceremony-orbit orbit-meridian" cx="500" cy="500" rx="138" ry="332" transform="rotate(18 500 500)" />
    <path class="ceremony-gear-light" d="M288 500 H712 M500 288 V712 M352 352 L648 648 M648 352 L352 648" />
  </g>

  <g class="ceremony-solar">
    <path class="ceremony-sun-arc" d="M238 506 C314 264 686 264 762 506" />
    <path class="ceremony-night-arc" d="M238 506 C328 724 672 724 762 506" />
  </g>

  <g class="ceremony-seasonal">
    <circle class="season-spark spring" cx="314" cy="684" r="13" />
    <circle class="season-spark summer" cx="386" cy="678" r="13" />
    <circle class="season-spark autumn" cx="386" cy="748" r="13" />
    <circle class="season-spark winter" cx="314" cy="748" r="13" />
    <path class="season-link" d="M314 684 C370 642 426 700 386 748 C334 790 272 728 314 684" />
  </g>

  <g class="ceremony-celestial">
    <path class="ceremony-star-line first" d="M356 404 L424 360 L492 390 L554 338 L636 392" />
    <path class="ceremony-star-line second" d="M360 528 L432 486 L486 534 L548 496 L628 542" />
    <circle class="ceremony-star sirio" cx="636" cy="392" r="7" />
    <circle class="ceremony-star vega" cx="500" cy="314" r="7" />
    <circle class="ceremony-star antares" cx="388" cy="648" r="7" />
  </g>

  <g class="ceremony-armillary-hint">
    <ellipse cx="500" cy="500" rx="510" ry="150" />
    <ellipse cx="500" cy="500" rx="492" ry="206" transform="rotate(31 500 500)" />
    <ellipse cx="500" cy="500" rx="492" ry="206" transform="rotate(-33 500 500)" />
  </g>

  <g class="ceremony-bell-group">
    <circle class="bell-halo" cx="500" cy="514" r="96" />
    <path class="bell-body" d="M454 524 C462 448 538 448 546 524 C570 544 562 584 500 588 C438 584 430 544 454 524 Z" />
    <circle class="bell-clapper" cx="500" cy="594" r="10" />
  </g>
</svg>
