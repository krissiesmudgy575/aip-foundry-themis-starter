# Demo Script

Use this script for a short community demo.

## 1. Position The Repo

Say:

"This repo answers one narrow question: how do I test the TypeScript contract logic around a Foundry-oriented workflow before deployment or platform evaluation?"

## 2. Show Deterministic Local Testing

Run:

```bash
npm test
```

Say:

"Themis is handling the local deterministic layer: request shaping, response validation, normalization, and failure handling."

## 3. Show The App-Facing Contract

Run:

```bash
npm run demo:osdk
```

Say:

"The app does not consume raw model output. It consumes a stable contract with queue, action, customer message, and telemetry."

## 4. Show The AIP Evals Bridge

Run:

```bash
npm run demo:handoff
```

Say:

"This does not replace AIP Evals. It gives a clean local artifact that can inform later platform evaluation."

## 5. Show The Installable UI Demo

Run:

```bash
cd examples/osdk-react-app
npm run dev
```

Say:

"This is the same contract layer rendered as a small OSDK-style app experience, which is a better adoption story than a repo with tests only."

## 6. Close

Say:

"The value here is shortening the path from agent idea to safe app integration, while staying complementary to AIP Evals."
