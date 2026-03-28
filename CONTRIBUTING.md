# Contributing

Keep contributions narrow, testable, and easy to explain.

## What Fits This Repo

- deterministic local contract tests around AIP Foundry-facing TypeScript code
- response normalization and failure handling
- app-facing contract shaping for OSDK-style consumers
- eval handoff artifacts that complement AIP Evals
- installability and demo quality improvements

## What Does Not Fit

- broad claims about full Foundry runtime parity
- features that turn the repo into a replacement for AIP Evals
- speculative integrations with undocumented or private APIs
- unrelated Themis framework work that does not improve this starter directly

## Local Workflow

```bash
npm install
npm run typecheck
npm run generate
npm test
```

If you touch the React example:

```bash
npm --prefix examples/osdk-react-app install
npm --prefix examples/osdk-react-app run build
```

## Pull Request Expectations

- keep the intake-triage story coherent
- update docs when behavior or positioning changes
- add or update tests with code changes
- prefer small, reviewable diffs over broad refactors

