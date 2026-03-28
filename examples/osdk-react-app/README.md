# OSDK React App Example

This example renders the repository's intake-triage contract as a small React app that feels closer to an OSDK-style workflow UI than a tests-only repo.

## Run It

```bash
cd examples/osdk-react-app
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## What It Shows

- the Foundry-facing request payload
- the normalized contract produced by local logic
- the app-facing view model consumed by UI code
- the eval handoff artifact that can inform later AIP Evals work

The app intentionally imports the root contract services instead of duplicating them so the example stays tied to the same logic covered by the Themis suite.

If you are adapting this example for a real integration, start with the root [README.md](/Users/higgs/github/aip-foundry-themis-starter/README.md) and [docs/integration-guide.md](/Users/higgs/github/aip-foundry-themis-starter/docs/integration-guide.md) before changing the UI.
