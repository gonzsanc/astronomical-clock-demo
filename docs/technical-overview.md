# Technical Overview

## Purpose

This is a static one-screen web demo. It exists to show Codex-assisted implementation, not to become a commercial product.

## Architecture

The app is a modular frontend:

- `src/domain` contains pure TypeScript state, timings, copy and ceremony steps.
- Visible labels and microcopy live in `src/domain/copy.ts`, so UI panels do not expose internal state IDs.
- `src/app` owns the local view-model and timers.
- `src/features/clock` renders the SVG/CSS clock and accessible interaction zones.
- `src/features/rete-celeste` dynamically imports Three.js for the Armillary Projection.
- `src/ui` contains secondary controls and side panel.
- `src/audio` provides optional Web Audio feedback.

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
