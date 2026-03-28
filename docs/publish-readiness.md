# Publish Readiness

Use this checklist before promoting the repository beyond internal sharing or a narrow community demo.

## Strong Public Shape

- one concrete use case
- one stable contract story
- one integration seam developers can actually adapt
- one small UI demo
- one eval handoff artifact
- one packaging command that produces a reviewable bundle

## What This Repo Already Has

- deterministic local contract tests with Themis
- a clear integration seam in `src/adapters/osdkTriageClient.ts`
- a React example in `examples/osdk-react-app`
- a proof bundle workflow plus export artifacts
- a tighter doc set:
  README, `docs/integration-guide.md`, `docs/install-and-demo.md`, and `docs/how-it-fits-with-aip-evals.md`

## Still Worth Doing Before Wider Promotion

- test the bundle on a fresh machine or clean clone
- replace placeholder visuals only if the asset shows a meaningful interaction or failure-recovery path
- add one real connector-backed example only when it can be documented publicly and supportably
- trim any copy that starts sounding broader than the public proof

## Packaging Command

```bash
npm run package:demo
```

This command:

1. runs root typecheck
2. regenerates Themis tests
3. runs the Themis suite
4. builds the React example
5. creates `.release/aip-foundry-themis-starter-demo.zip`

## Bundle Contents

- docs
- source and tests
- root demo examples
- prebuilt React demo app
- package manifest
- install instructions
- visual assets
