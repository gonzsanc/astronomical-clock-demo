# Technical Overview

## Purpose

This is a static one-screen web demo. It exists to show Codex-assisted implementation, not to become a commercial product.

## Architecture

The app is a modular frontend:

- `src/domain` contains pure TypeScript state, timings, copy and ceremony steps.
- Visible labels and microcopy live in `src/domain/copy.ts`, but the main interaction feedback is visual.
- `src/app` owns the local view-model and timers.
- `src/app/App.svelte` wraps the clock and Armillary Projection in `.clock-placement` so desktop layout can reserve a text column while keeping the projection centered on the clock.
- `src/features/clock` renders the optimized clock artwork, SVG hands, visual overlays and accessible interaction zones.
- `public/assets/clock/reloj_astronomico_base.webp` is the current visual baseline for the clock body.
- `src/features/clock/ClockHands.svelte` keeps the hand geometry isolated from state management and uses `clockHandAngles.ts` to map real local time to hour/minute rotations. Hands update by minute, not by second.
- `src/features/clock/ClockInteractionOverlay.svelte` draws finite SVG overlays for day/night, moon, seasons, constellations and Rete states.
- `src/features/clock/ClockHitZones.svelte` renders calibrated HTML buttons above the real clock artwork; coordinates live in `clockHitZones.ts`.
- `src/features/clock/ClockCeremonyOverlay.svelte` draws the ceremonial timeline as visual phases instead of visible status text.
- `src/features/rete-celeste` dynamically imports Three.js for the Armillary Projection, now limited to a translucent dome with ecliptic, equator, meridians, tropics, axis and stars.
- `src/audio` provides optional Web Audio feedback; sound remains non-critical and muted unless a later demo cut restores controls.

The current demo intentionally has no bottom control dock and no visible status ticker. Aside from real clock-hand updates by minute, visual activity is triggered by interaction.

Final cleanup removed the old absolute SVG hit-zone classes and the legacy side-panel state (`panelOpen`, `openPanel`, `closePanel`). The active interaction surface is `ClockHitZones.svelte` plus `clock-hit-zones.css`.

The Rete Celeste is the main visual gesture. The ceremony uses the same clock as a stage: frame sweep, rings, constellations, armillary projection, central bell and final inscription.

Hit-zone debug mode is available at `?hitZones=1`. It is not visible by default and exists only to review calibration and tab order during development.

## State Model

Main modes:

- `idle`
- `dayNight`
- `moonPhase`
- `seasons`
- `constellations`
- `ceremony`
- `final`

Visual states:

- `loading`
- `initialRest`
- `exploration`
- `armillaryProjection`
- `seasonTransition`
- `ceremony`
- `final`
- `resetting`
- `resourceError`

## Testing

Vitest covers deterministic domain behavior. Playwright covers the main user flows using `?demoSpeed=fast` so the 32-second ceremony does not slow the suite.

## Deployment

The app builds to `dist` and can be served by Netlify, Cloudflare Pages, GitHub Pages or any static host.
