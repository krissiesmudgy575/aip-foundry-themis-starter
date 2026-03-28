# Install And Demo

Use this file for the shortest end-to-end walkthrough of the repository.

## Root Demo

```bash
npm install
npm run generate
npm test
npm run demo:osdk
npm run demo:handoff
npm run export:demo
```

This sequence proves the local contract loop:

- request shaping
- runtime validation
- deterministic normalization
- app-facing envelope generation
- eval handoff artifact export

## React Demo

```bash
cd examples/osdk-react-app
npm install
npm run dev
```

The React app imports the root contract services directly. It renders:

- the request payload
- the normalized result
- the app-facing view model
- the eval handoff artifact

## Suggested 5-Minute Walkthrough

1. Run `npm test` and point out the deterministic failure coverage.
2. Run `npm run demo:osdk` and show the normalized contract instead of raw model text.
3. Run `npm run demo:handoff` and explain how the local artifact can inform later platform evaluation.
4. Open the React app and show the same contract flow in UI form.
5. End by showing the primary customization points in the root README.

## Files To Open During The Demo

- `src/contracts/schemas.ts`
- `src/services/resultNormalizer.ts`
- `src/adapters/osdkTriageClient.ts`
- `src/services/evalHandoffBuilder.ts`
- `examples/osdk-react-app/src/App.tsx`

## Shareable Bundle

```bash
npm run package:demo
```

This creates `.release/aip-foundry-themis-starter-demo.zip` for review or lightweight sharing.
