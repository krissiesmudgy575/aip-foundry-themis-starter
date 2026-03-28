# Community Registry Submission

If this repository is described in a community registry, the safest short pitch is:

- unofficial TypeScript example
- deterministic local contract testing with Themis
- one concrete Foundry-oriented workflow example
- one clear integration seam for adapting a real client
- complementary to later platform evaluation

## What To Highlight

- runtime schema validation before app code consumes model output
- deterministic handling of malformed output, missing fields, unsupported status values, and fallback paths
- a reviewable normalized contract instead of raw model text
- a small UI example plus exported proof artifacts

## What To Avoid

- claims that the repo is official, certified, or partner-maintained
- claims about undocumented runtime behavior
- language that implies this replaces AIP Evals
- broad framework positioning that is larger than the example actually proves

## Minimum Publishable Asset Checklist

- one screenshot or short motion asset
- one example app consumer such as `examples/osdk-client-example.ts`
- one handoff artifact such as `examples/eval-handoff-example.json`
- one integration guide such as `docs/integration-guide.md`
- one explicit customization path in the README
- one shareable bundle from `npm run package:demo`
