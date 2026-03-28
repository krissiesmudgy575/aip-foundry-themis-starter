# Integration Guide

Use this guide when you want to replace the mock client seam with a real agent, function, or OSDK-like integration.

The important boundary in this repository is not the example transport. It is the normalization boundary:

- raw output in
- runtime validation
- stable app-facing contract out

## What To Preserve

- runtime schema validation in `src/contracts/schemas.ts`
- deterministic normalization in `src/services/resultNormalizer.ts`
- telemetry capture in `src/adapters/foundryResponse.ts`
- app-facing envelopes in `src/services/triageAppViewModel.ts` and `src/services/osdkResultEnvelope.ts`
- deterministic tests before broader regeneration

## Integration Path

### 1. Keep The App Contract Stable

Start with the contract your app actually needs, not the raw model output you happen to receive today.

The main files are:

- `src/contracts/types.ts`
- `src/contracts/schemas.ts`
- `src/services/resultNormalizer.ts`

If the raw JSON changes, update the schema first, then the normalizer.

### 2. Adapt The Outbound Request

`src/adapters/foundryRequest.ts` turns `AgentCallInput` into the request payload sent to the external system.

Edit this file when:

- the target API expects different field names
- you need to attach extra workflow metadata
- the prompt field should be wrapped or renamed

### 3. Adapt The Inbound Response

`src/adapters/foundryResponse.ts` extracts the fields this repo needs from a raw response:

- `outputText`
- `requestId`
- `caseId`
- `source`
- telemetry such as `modelName`, `latencyMs`, `retryCount`, and `fallbackUsed`

If your real client returns a different shape, adapt it here instead of leaking transport-specific details deeper into the repo.

### 4. Replace The Mock Client Seam

`src/adapters/osdkTriageClient.ts` is the place to swap in a real client.

It expects a client with:

```ts
interface OsdkLikeAgentClient {
  invokeTriage(request: ReturnType<typeof toFoundryRequest>): Promise<unknown>;
}
```

That means you can keep the repo structure and only change the transport layer.

Minimal shape:

```ts
const client = {
  async invokeTriage(request) {
    const response = await realClient.invoke(request);

    return {
      outputText: response.outputText,
      requestId: response.requestId,
      source: "agent",
      telemetry: {
        modelName: response.modelName,
        latencyMs: response.latencyMs,
        retryCount: response.retryCount,
        fallbackUsed: response.fallbackUsed,
      },
    };
  },
};
```

If your real client does not return that shape directly, normalize it in `invokeTriage()` or in `src/adapters/foundryResponse.ts`.

### 5. Keep Failure Handling Deterministic

This repo is strongest when it fails in explicit, typed ways:

- malformed JSON -> `INVALID_JSON`
- missing required fields -> `SCHEMA_VALIDATION_FAILED`
- unsupported status -> `UNSUPPORTED_STATUS`
- empty output -> `EMPTY_OUTPUT`

Do not let the UI or app code parse raw model text directly.

## Recommended Edit Order

1. `src/contracts/schemas.ts`
2. `src/services/resultNormalizer.ts`
3. `src/adapters/foundryRequest.ts`
4. `src/adapters/foundryResponse.ts`
5. `src/adapters/osdkTriageClient.ts`
6. `src/services/triageAppViewModel.ts` or `src/services/osdkResultEnvelope.ts`
7. `src/services/evalHandoffBuilder.ts`

## Validation Loop

```bash
npm install
npm run generate
npm test
npm run demo:osdk
npm run export:demo
```

Use the React demo under `examples/osdk-react-app/` only after the core contract loop is stable.
