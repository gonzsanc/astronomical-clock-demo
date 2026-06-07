<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { clockHandAngles } from './clockHandAngles';

  export let reducedMotion = false;

  let now = new Date();
  let timer: number | undefined;

  onMount(() => {
    const updateAtNextMinute = () => {
      now = new Date();
      const delay = 60_000 - now.getSeconds() * 1000 - now.getMilliseconds();
      timer = window.setTimeout(updateAtNextMinute, delay);
    };

    updateAtNextMinute();
  });

  onDestroy(() => {
    if (timer) window.clearTimeout(timer);
  });

  $: angles = clockHandAngles(now);
  $: mainRotation = angles.minute;
  $: secondaryRotation = angles.hour;
</script>

<svg class="clock-hands" viewBox="0 0 1000 1000" aria-hidden="true">
  <defs>
    <linearGradient id="mainHandGold" x1="0%" x2="100%" y1="0%" y2="0%">
      <stop offset="0%" stop-color="#5a3816" />
      <stop offset="18%" stop-color="#f2c76f" />
      <stop offset="48%" stop-color="#fff0af" />
      <stop offset="72%" stop-color="#b87d2f" />
      <stop offset="100%" stop-color="#3b230f" />
    </linearGradient>
    <linearGradient id="secondaryHandSilver" x1="0%" x2="100%" y1="0%" y2="0%">
      <stop offset="0%" stop-color="#3f4d52" />
      <stop offset="22%" stop-color="#d7e2dd" />
      <stop offset="54%" stop-color="#fff6d0" />
      <stop offset="100%" stop-color="#6b7b78" />
    </linearGradient>
    <radialGradient id="handCapGold" cx="42%" cy="32%" r="68%">
      <stop offset="0%" stop-color="#fff5be" />
      <stop offset="42%" stop-color="#d39a42" />
      <stop offset="78%" stop-color="#6f4318" />
      <stop offset="100%" stop-color="#1c1008" />
    </radialGradient>
    <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="7" stdDeviation="5" flood-color="#000000" flood-opacity="0.48" />
    </filter>
  </defs>

  <g class="secondary-hand" style={`transform: rotate(${secondaryRotation}deg)`}>
    <path class="secondary-body" d="M489 505 L495 342 L500 300 L505 342 L511 505 L500 532 Z" />
    <path class="secondary-ridge" d="M500 330 L500 515" />
    <path class="secondary-tail" d="M494 500 L500 584 L506 500 Z" />
    <polygon class="secondary-tip" points="500,282 513,320 500,342 487,320" />
  </g>

  <g
    class:reduced={reducedMotion}
    class="main-hand"
    style={`transform: rotate(${mainRotation}deg)`}
  >
    <path class="main-body" d="M486 505 L496 248 L500 205 L504 248 L514 505 L500 548 Z" />
    <path class="main-ridge" d="M500 232 L500 525" />
    <path class="main-tail" d="M491 500 L497 588 L500 612 L503 588 L509 500 Z" />
    <polygon class="main-tip" points="500,184 516,226 500,256 484,226" />
    <g class="main-ornament" transform="translate(500 322)">
      <circle r="19" />
      <path d="M0 -36 L0 -22 M0 22 L0 36 M-36 0 L-22 0 M22 0 L36 0" />
      <path d="M-25 -25 L-15 -15 M15 15 L25 25 M25 -25 L15 -15 M-15 15 L-25 25" />
    </g>
  </g>

  <g class="hand-cap">
    <circle class="cap-shadow" cx="500" cy="500" r="31" />
    <circle class="cap-ring" cx="500" cy="500" r="25" />
    <circle class="cap-dome" cx="500" cy="500" r="17" />
    <circle class="cap-rivet" cx="500" cy="500" r="5" />
  </g>
</svg>
