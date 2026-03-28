import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { buildThemisSummaryArtifact } from "../src/services/themisSummaryBuilder";

describe("buildThemisSummaryArtifact", () => {
  test("builds a compact machine-readable summary from Themis artifacts", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "themis-summary-"));

    try {
      const lastRunPath = join(tempDir, "last-run.json");
      const failedTestsPath = join(tempDir, "failed-tests.json");
      const generateLastPath = join(tempDir, "generate-last.json");

      await writeFile(
        lastRunPath,
        JSON.stringify({
          startedAt: "2026-03-28T20:00:00.000Z",
          totals: {
            passed: 12,
            failed: 1,
            skipped: 0,
            total: 13,
          },
          failureClusters: [{ message: "invalid json output" }],
        }),
      );
      await writeFile(
        failedTestsPath,
        JSON.stringify({
          failures: [{ testName: "normalizeAgentResult rejects malformed json" }],
        }),
      );
      await writeFile(
        generateLastPath,
        JSON.stringify({
          generatedFiles: [
            "__themis__/tests/services/resultNormalizer.generated.test.ts",
          ],
        }),
      );

      const summary = await buildThemisSummaryArtifact({
        lastRunPath,
        failedTestsPath,
        generateLastPath,
      });

      expect(summary).toEqual({
        schemaVersion: "0.1",
        useCase: "intake-triage",
        generatedAt: "2026-03-28T20:00:00.000Z",
        sourceArtifacts: {
          lastRunPath,
          failedTestsPath,
          generateLastPath,
        },
        totals: {
          passed: 12,
          failed: 1,
          skipped: 0,
          total: 13,
        },
        failedTests: ["normalizeAgentResult rejects malformed json"],
        failureClusters: ["invalid json output"],
        generatedFiles: [
          "__themis__/tests/services/resultNormalizer.generated.test.ts",
        ],
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});

