# Astronomical Clock Demo

Interactive astronomical clock demo built with Codex.

This project is a portable static web app for showing a team how Codex can move from governed specification to implementation, tests, documentation, commit and deployment.

## Stack

- Svelte
- TypeScript
- Vite
- Three.js
- CSS/SVG
- Vitest
- Playwright

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Fast demo mode for tests and walkthroughs:

```text
http://127.0.0.1:5173/?demoSpeed=fast
```

## Validate

```bash
npm run check
npm run test
npm run test:e2e
npm run build
```

All checks together:

```bash
npm run quality
```

Preview the built static app:

```bash
npm run preview
```

## Deploy

Netlify settings:

```text
Build command: npm run build
Publish directory: dist
```

The same settings are stored in `netlify.toml`.

## Project Shape

```text
src/
  app/
  domain/
  features/clock/
  features/rete-celeste/
  ui/
  audio/
  styles/
tests/
e2e/
docs/
```

## Notes

- The app has no backend, database or live AI dependency.
- Three.js is dynamically loaded only for the Armillary Projection.
- The core rules live in pure TypeScript under `src/domain`.
- The public docs are in `docs/`; governed project documentation lives outside this repo under `.org/Reloj_Astronomico`.
