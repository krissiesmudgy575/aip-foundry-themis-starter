# aip-foundry-themis-starter

[![Proof Bundle](https://github.com/vitron-ai/aip-foundry-themis-starter/actions/workflows/proof-bundle.yml/badge.svg)](https://github.com/vitron-ai/aip-foundry-themis-starter/actions/workflows/proof-bundle.yml)

`aip-foundry-themis-starter` is an unofficial TypeScript example for deterministic local contract testing around Foundry-oriented workflows.

It shows one narrow story end to end:

- shape a workflow request
- validate raw agent or function output with runtime schemas
- normalize that output into a stable app-facing contract
- preserve telemetry and fallback state
- export a proof artifact for later platform evaluation

## Disclaimer

This project is an independent open-source example. It is not affiliated with, endorsed by, or maintained by Palantir Technologies. References to Palantir, Foundry, AIP, and OSDK are descriptive only and should not be read as claims of official support, certification, or partnership.

## What This Repo Proves

- Themis can act as a deterministic local contract layer around TypeScript code you control.
- Raw model-style JSON can be normalized into a stable typed envelope before app code consumes it.
- Failure modes such as malformed JSON, missing fields, unsupported status values, and fallback behavior can be tested locally and deterministically.
- A local proof bundle can hand cleanly into later platform evaluation without claiming to replace AIP Evals.

## 3-Minute Quickstart

```bash
npm install
npm run generate
npm test
npm run demo:osdk
npm run demo:handoff
npm run export:demo
```

If you want the small UI demo:

```bash
cd examples/osdk-react-app
npm install
npm run dev
```

## Flow At A Glance

| Stage | Main file | Output | Why it matters |
| --- | --- | --- | --- |
| Request shaping | `src/services/agentInputBuilder.ts` and `src/adapters/foundryRequest.ts` | reviewable request payload | keeps the outbound contract explicit |
| Response extraction | `src/adapters/foundryResponse.ts` | raw response envelope | preserves `requestId`, source, latency, retries, and fallback state |
| Normalization | `src/services/resultNormalizer.ts` | `NormalizationResult` | rejects malformed or unsupported output before app code sees it |
| App contract | `src/services/triageAppViewModel.ts` and `src/services/osdkResultEnvelope.ts` | stable UI-safe envelope | keeps app code off raw model text |
| Eval handoff | `src/services/evalHandoffBuilder.ts` | reviewable handoff artifact | bridges local contract checks to later platform evaluation |

## Customize These Files First

| File | Change it when | Why it is first |
| --- | --- | --- |
| `src/contracts/schemas.ts` | the raw output JSON shape changes | this is the runtime contract boundary |
| `src/services/resultNormalizer.ts` | routing, fallback, or failure behavior changes | this is where raw output becomes a stable typed result |
| `src/adapters/osdkTriageClient.ts` | you want a real agent, function, or OSDK-like client | this is the integration seam |
| `src/services/evalHandoffBuilder.ts` | your later evaluation workflow needs different context | this controls the exported proof shape |
| `src/services/triageAppViewModel.ts` | your UI contract changes | this keeps presentation logic separate from normalization |

## Failure Coverage

| Scenario | Deterministic result | Test |
| --- | --- | --- |
| Happy path | stable typed contract with telemetry | `tests/resultNormalizer.test.ts` |
| Malformed JSON | `INVALID_JSON` | `tests/resultNormalizer.test.ts` |
| Missing fields | `SCHEMA_VALIDATION_FAILED` | `tests/failure-modes.test.ts` |
| Unsupported status | `UNSUPPORTED_STATUS` | `tests/failure-modes.test.ts` |
| Empty output | `EMPTY_OUTPUT` | `tests/failure-modes.test.ts` |
| Retry or fallback path | normalized fallback action plus telemetry preservation | `tests/resultNormalizer.test.ts` |

## Plug In A Real Client

The repo already has the seam for this in [src/adapters/osdkTriageClient.ts](/Users/higgs/github/aip-foundry-themis-starter/src/adapters/osdkTriageClient.ts).

The short version:

1. Keep `normalizeAgentResult()` as the boundary between raw output and app-safe types.
2. Adapt your outbound payload in [src/adapters/foundryRequest.ts](/Users/higgs/github/aip-foundry-themis-starter/src/adapters/foundryRequest.ts).
3. Adapt your inbound response in [src/adapters/foundryResponse.ts](/Users/higgs/github/aip-foundry-themis-starter/src/adapters/foundryResponse.ts).
4. Replace the mock `invokeTriage()` implementation with your real client call in [src/adapters/osdkTriageClient.ts](/Users/higgs/github/aip-foundry-themis-starter/src/adapters/osdkTriageClient.ts).

Use [docs/integration-guide.md](/Users/higgs/github/aip-foundry-themis-starter/docs/integration-guide.md) for the exact adaptation path.

## Demo Outputs And Proof Artifacts

`npm run export:demo` writes:

- `artifacts/demo-export/normalized-result.json`
- `artifacts/demo-export/osdk-envelope.json`
- `artifacts/demo-export/eval-handoff.json`
- `artifacts/demo-export/themis-summary.json`

These are the main proof artifacts for local review, CI publishing, and later evaluation design.

## Local Positioning

The narrow message for this repo is:

- local contracts with Themis
- platform evaluation later

This is not a replacement for AIP Evals, and it does not claim to simulate the full Foundry runtime.

## Docs

- [docs/integration-guide.md](/Users/higgs/github/aip-foundry-themis-starter/docs/integration-guide.md): replace the mock client seam with a real integration
- [docs/install-and-demo.md](/Users/higgs/github/aip-foundry-themis-starter/docs/install-and-demo.md): quick demo walkthrough and reviewer talk track
- [docs/how-it-fits-with-aip-evals.md](/Users/higgs/github/aip-foundry-themis-starter/docs/how-it-fits-with-aip-evals.md): local deterministic tests vs later platform evaluation
- [docs/publish-readiness.md](/Users/higgs/github/aip-foundry-themis-starter/docs/publish-readiness.md): what still matters before broader promotion
- [examples/osdk-react-app/README.md](/Users/higgs/github/aip-foundry-themis-starter/examples/osdk-react-app/README.md): run the React demo that imports the root contract logic

## Copy This Into Your Repo

If you want to adapt this starter instead of using it as-is:

1. Keep `src/contracts/`, `src/services/resultNormalizer.ts`, `src/adapters/foundryRequest.ts`, `src/adapters/foundryResponse.ts`, and `tests/`.
2. Replace the intake-triage example payload and routing logic with your workflow.
3. Update the handwritten tests before regenerating broader Themis coverage.
4. Keep the app-facing contract stable even if your raw output format changes.

## Repo Shape

```text
src/contracts/            Runtime schemas and app-facing types
src/adapters/             Request and response seams
src/services/             Normalization, view model, handoff, and export logic
tests/                    Handwritten deterministic contract tests
examples/                 Runnable demos and static example artifacts
examples/osdk-react-app/  Small UI example importing the root logic
docs/                     Integration, demo, positioning, and publish guidance
assets/                   Architecture visual and screenshot
```
