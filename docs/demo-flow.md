# Demo Flow

Use this sequence to show how Codex developed the project.

## 1. Grounding

- Codex reads `AGENTS.md`, project governance and active Markdown specification.
- The Word files are treated as legacy and not used as the working source.
- The stack and deployment target are confirmed before coding.

## 2. Planning

- Codex turns the specification into an implementation plan.
- The plan includes architecture, phases, tests, deployment and documentation.
- The plan is saved in the governed documentation area.

## 3. Implementation

- The app starts from a small Vite/Svelte scaffold.
- Domain rules are implemented before visual complexity.
- UI is built as one screen centered on the clock.
- Three.js is isolated to the Rete Celeste Armillary Projection.
- Visual quality is improved in cuts: real clock artwork, real-time hands, richer Rete projection and a separate ceremonial overlay.

## 4. Validation

- `npm run check` verifies Svelte and TypeScript.
- `npm run test` validates domain transitions and timings.
- `npm run test:e2e` validates user flows.
- `npm run build` proves the static deployment artifact.

## 5. Documentation

- Architecture, diagrams, development guide, deployment guide and validation plan are maintained while coding.
- The repo README keeps only the public, practical summary.

## 6. Deployment

- Push the `dev` branch.
- Connect Netlify to the GitHub repo.
- Use `npm run build` and `dist`.
