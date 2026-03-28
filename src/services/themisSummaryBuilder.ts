import { readFile } from "node:fs/promises";
import type { ThemisSummaryArtifact } from "../contracts/types";

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export interface BuildThemisSummaryArtifactParams {
  lastRunPath: string;
  failedTestsPath: string;
  generateLastPath: string;
}

export async function buildThemisSummaryArtifact(
  params: BuildThemisSummaryArtifactParams,
): Promise<ThemisSummaryArtifact> {
  const lastRunRaw = await readFile(params.lastRunPath, "utf8").catch(
    () => JSON.stringify({}),
  );
  const failedTestsRaw = await readFile(params.failedTestsPath, "utf8").catch(
    () => JSON.stringify({}),
  );
  const generateLastRaw = await readFile(params.generateLastPath, "utf8").catch(
    () => JSON.stringify({}),
  );

  const lastRun = asRecord(JSON.parse(lastRunRaw));
  const failedTests = asRecord(JSON.parse(failedTestsRaw));
  const generateLast = asRecord(JSON.parse(generateLastRaw));

  const totals = asRecord(lastRun.totals);
  const failures = asArray(failedTests.failures).map((entry) => {
    const record = asRecord(entry);
    return readString(record.testName) ?? readString(record.name) ?? "unknown";
  });
  const failureClusters = asArray(lastRun.failureClusters).map((entry) => {
    const record = asRecord(entry);
    return readString(record.message) ?? readString(record.id) ?? "unknown";
  });
  const generatedFiles = asArray(generateLast.generatedFiles).map((entry) => {
    if (typeof entry === "string") {
      return entry;
    }
    return readString(asRecord(entry).path) ?? "unknown";
  });

  return {
    schemaVersion: "0.1",
    useCase: "intake-triage",
    generatedAt: readString(lastRun.startedAt) ?? new Date().toISOString(),
    sourceArtifacts: {
      lastRunPath: params.lastRunPath,
      failedTestsPath: params.failedTestsPath,
      generateLastPath: params.generateLastPath,
    },
    totals: {
      passed: readNumber(totals.passed),
      failed: readNumber(totals.failed),
      skipped: readNumber(totals.skipped),
      total: readNumber(totals.total),
    },
    failedTests: failures,
    failureClusters,
    generatedFiles,
  };
}
