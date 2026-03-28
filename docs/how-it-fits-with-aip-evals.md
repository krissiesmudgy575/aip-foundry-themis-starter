# How It Fits With AIP Evals

This starter is for local deterministic contract testing.

In this repository, Themis is the mechanism used to run that local deterministic layer.

It is useful when you want to verify the logic you control before deployment:

- request shaping
- schema validation
- normalization into stable app-facing types
- deterministic handling of malformed outputs and missing fields
- telemetry preservation for later observability work
- creation of a local eval-handoff artifact

## What Happens Locally

Local tests should answer questions like:

- Does this adapter shape the request we expect?
- Does this service reject malformed output deterministically?
- Does app code receive one stable contract regardless of raw response variation?
- Are retry counts, latency, and fallback usage preserved for later analysis?
- Can we export one reviewable artifact that captures what the local contract expected?

In this example, Themis is how those questions are answered quickly in a TypeScript workflow before anything is pushed into Foundry.

## What Happens In Foundry

AIP Evals should answer a different class of questions:

- broader behavioral quality
- platform-level evaluation flows
- comparison across prompts, models, or configurations
- metrics that depend on realistic execution context

## Practical Positioning

The clean message for this repository is:

- local contracts with Themis
- platform evals with Foundry

In this repository, the bridge between those layers is `src/services/evalHandoffBuilder.ts`. It does not claim to emit an official AIP Evals import format. It gives teams a starter artifact that records:

- the request context used locally
- the normalized contract expected by app code
- deterministic failure outcomes when normalization breaks
- suggested evaluation dimensions to recreate later in Foundry

That framing makes the repo easier to explain, easier to publish, and less likely to overclaim what local tests can prove.
