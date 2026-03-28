# AGENTS.md

This repository is for deterministic local contract testing around TypeScript code used in Foundry-oriented workflows.

It is an unofficial example repository. Do not write or imply that it is affiliated with, endorsed by, certified by, or maintained by Palantir.

## Working Rules

- Prefer deterministic tests over probabilistic assertions.
- Use Themis as the default unit test framework in this repo.
- Treat local tests as contract checks for code you control.
- Use runtime schema validation for all model or agent outputs.
- Normalize raw responses into a stable typed contract before app code consumes them.
- Preserve telemetry fields such as `requestId`, `modelName`, `latencyMs`, `retryCount`, and `fallbackUsed`.
- Test explicit failure modes: empty output, malformed JSON, missing fields, unsupported status values, retry exhaustion, and fallback behavior.

## Scope Rules

- Do not present this repo as a replacement for AIP Evals.
- Do not make deep Foundry runtime claims unless they are documented and publicly supportable.
- Do not describe any adapter, artifact, or example as official unless that can be publicly verified.
- Do not let diagrams, screenshots, or UI copy imply official platform status.
- Keep examples centered on request shaping, response validation, normalization, and failure handling.

## Why Themis Is In Scope

- Themis is the deterministic local contract layer in this repository.
- It is used to validate the code around the model, not to replace platform evaluation.
- The repo should keep showing how Themis helps app developers catch contract drift before Foundry deployment.

## Messaging Guidance

- When describing the repo, emphasize deterministic local contract testing first.
- Explain Themis as the local developer loop for request shaping, response validation, normalization, and failure handling.
- Position AIP Evals as the later platform evaluation layer.
- Prefer "Foundry-oriented workflows" or "developers integrating with Foundry-style workflows" over language that sounds official or partner-approved.
- Keep the core story narrow: safer app integration before deployment, not full runtime simulation.

## What To Preserve

- Keep Themis as the default framework for both handwritten and generated contract tests.
- Keep at least one clear example of empty-output handling, malformed-output handling, missing-fields handling, unsupported-status handling, and deterministic fallback behavior.
- Keep the OSDK-like seam reviewable so developers can see where a real client would plug in.
- Keep the exported proof artifacts working:
  - `artifacts/demo-export/normalized-result.json`
  - `artifacts/demo-export/osdk-envelope.json`
  - `artifacts/demo-export/eval-handoff.json`
  - `artifacts/demo-export/themis-summary.json`

## Preferred Contributor Moves

- If raw output changes, update schemas first, then the normalizer, then the app-facing envelope.
- If behavior changes, update handwritten tests before regenerating Themis coverage.
- If files under `src/adapters/` or `src/services/` change, rerun `npx themis generate src` before `npx themis test`.
- If examples drift from the main story, simplify them instead of adding more verticals.
- If adding documentation, keep `README.md`, `docs/integration-guide.md`, and `docs/how-it-fits-with-aip-evals.md` aligned.
- Do not hand-edit `.release/` or `artifacts/demo-export/`; regenerate them with the repo commands when needed.

## Preferred Test Shape

- one happy-path test
- one malformed-output test
- one missing-fields test
- one deterministic fallback or failure-path test

When the change affects failure handling, prefer covering `EMPTY_OUTPUT` or `UNSUPPORTED_STATUS` explicitly instead of folding everything into one generic validation failure.

## Default Commands

```bash
npm run typecheck
npx themis generate src
npx themis test
npm run export:demo
npm run package:demo
```

## Customization Guidance

- Edit `src/contracts/` first when changing the app-facing contract.
- Update `src/services/resultNormalizer.ts` when the raw output format changes.
- Use `src/adapters/osdkTriageClient.ts` as the main seam when swapping in a real client.
- Add tests before broadening adapters or examples.

## Docs To Keep Aligned

- `README.md`
- `docs/integration-guide.md`
- `docs/install-and-demo.md`
- `docs/how-it-fits-with-aip-evals.md`
