import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { buildAgentInput } from "../src/services/agentInputBuilder";
import { executeTriageWithOsdkClient } from "../src/adapters/osdkTriageClient";
import { buildTriageAppViewModel } from "../src/services/triageAppViewModel";
import { buildEvalHandoffArtifact } from "../src/services/evalHandoffBuilder";
import { buildOsdkResultEnvelope } from "../src/services/osdkResultEnvelope";
import { buildThemisSummaryArtifact } from "../src/services/themisSummaryBuilder";

const execFileAsync = promisify(execFile);

async function run(cmd, args) {
  const { stdout, stderr } = await execFileAsync(cmd, args, {
    cwd: process.cwd(),
    env: process.env,
  });
  if (stdout.trim()) {
    process.stdout.write(stdout);
  }
  if (stderr.trim()) {
    process.stderr.write(stderr);
  }
}

async function main() {
  await run("npm", ["run", "generate"]);
  await run("npm", ["test"]);

  const artifactsDir = join(process.cwd(), "artifacts", "demo-export");
  await rm(artifactsDir, { recursive: true, force: true });
  await mkdir(artifactsDir, { recursive: true });

  const input = buildAgentInput({
    userPrompt: "Triage an inbound dispute for potential fraud escalation.",
    conversationId: "export-demo-conversation",
    caseId: "case-export-001",
    targetQueue: "operations-triage",
    requestedAt: "2026-03-28T20:00:00.000Z",
  });

  const triageResult = await executeTriageWithOsdkClient(
    {
      async invokeTriage() {
        return {
          outputText: JSON.stringify({
            status: "success",
            summary: "The dispute should be escalated to incident response.",
            score: 0.96,
            priority: "high",
            customerMessage:
              "Your request was received and escalated for rapid review.",
            warnings: ["Chargeback pattern matched a prior fraud cluster."],
          }),
          requestId: "req-export-001",
          source: "agent",
          modelName: "gpt-4.1",
          latencyMs: 720,
          retryCount: 0,
          fallbackUsed: false,
        };
      },
    },
    input,
  );

  if (!triageResult.normalized.ok) {
    throw new Error("Expected successful normalization for export demo.");
  }

  const viewModel = buildTriageAppViewModel(input, triageResult.normalized.value);
  const themisSummary = await buildThemisSummaryArtifact({
    lastRunPath: join(process.cwd(), ".themis", "runs", "last-run.json"),
    failedTestsPath: join(process.cwd(), ".themis", "runs", "failed-tests.json"),
    generateLastPath: join(process.cwd(), ".themis", "generate", "generate-last.json"),
  });
  const themisSummaryPath = "artifacts/demo-export/themis-summary.json";

  const osdkEnvelope = buildOsdkResultEnvelope({
    result: triageResult.normalized.value,
    viewModel,
    themisPassed: themisSummary.totals.failed === 0,
    artifactPath: themisSummaryPath,
  });
  const evalHandoff = buildEvalHandoffArtifact({
    scenarioId: "export-demo-escalation",
    input,
    envelope: triageResult.envelope,
    result: triageResult.normalized,
  });

  await writeFile(
    join(artifactsDir, "normalized-result.json"),
    JSON.stringify(triageResult.normalized.value, null, 2),
  );
  await writeFile(
    join(artifactsDir, "osdk-envelope.json"),
    JSON.stringify(osdkEnvelope, null, 2),
  );
  await writeFile(
    join(artifactsDir, "eval-handoff.json"),
    JSON.stringify(evalHandoff, null, 2),
  );
  await writeFile(
    join(artifactsDir, "themis-summary.json"),
    JSON.stringify(themisSummary, null, 2),
  );
  await writeFile(
    join(artifactsDir, "export-manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        files: [
          "normalized-result.json",
          "osdk-envelope.json",
          "eval-handoff.json",
          "themis-summary.json",
        ],
      },
      null,
      2,
    ),
  );

  console.log(`Exported demo artifacts to ${artifactsDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

