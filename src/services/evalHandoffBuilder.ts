import type {
  AgentCallInput,
  EvalHandoffArtifact,
  NormalizationResult,
  RawAgentResultEnvelope,
} from "../contracts/types";

export interface BuildEvalHandoffArtifactParams {
  scenarioId: string;
  input: AgentCallInput;
  envelope: RawAgentResultEnvelope;
  result: NormalizationResult;
}

function normalizeLatencyMs(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeRetryCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

export function buildEvalHandoffArtifact(
  params: BuildEvalHandoffArtifactParams,
): EvalHandoffArtifact {
  const retryCount = params.result.ok
    ? params.result.value.telemetry.retryCount
    : normalizeRetryCount(params.envelope.retryCount);
  const fallbackUsed = params.result.ok
    ? params.result.value.telemetry.fallbackUsed
    : params.envelope.fallbackUsed === true;
  const modelName = params.result.ok
    ? params.result.value.telemetry.modelName
    : params.envelope.modelName ?? null;
  const latencyMs = params.result.ok
    ? params.result.value.telemetry.latencyMs
    : normalizeLatencyMs(params.envelope.latencyMs);
  const requestId = params.result.ok
    ? params.result.value.requestId
    : params.result.requestId;
  const source = params.result.ok
    ? params.result.value.source
    : params.envelope.source ?? "unknown";

  const suggestedEvalDimensions = [
    "triage_accuracy",
    "priority_assignment",
    "customer_message_quality",
  ];

  if (fallbackUsed || retryCount > 0) {
    suggestedEvalDimensions.push("fallback_recovery");
  }

  if (!params.result.ok) {
    suggestedEvalDimensions.push("malformed_output_recovery");
  }

  return {
    schemaVersion: "0.1",
    useCase: "intake-triage",
    scenarioId: params.scenarioId,
    localContractOutcome: params.result.ok ? "pass" : "fail",
    request: params.input,
    responseContext: {
      caseId: params.input.caseId,
      requestId,
      source,
      modelName,
      latencyMs,
      retryCount,
      fallbackUsed,
    },
    expectedContract: params.result.ok
      ? {
          type: "normalized-result",
          value: params.result.value,
        }
      : {
          type: "normalization-failure",
          value: {
            code: params.result.code,
            message: params.result.message,
            caseId: params.result.caseId,
            requestId: params.result.requestId,
            rawOutput: params.result.rawOutput,
          },
        },
    suggestedEvalDimensions,
    suggestedAssertions: params.result.ok
      ? [
          "The model assigns the correct triage priority for the case.",
          "The recommended action is consistent with the normalized queue.",
          "The customer-facing message is safe, concise, and aligned with the case outcome.",
        ]
      : [
          "Malformed or incomplete output should fail deterministically.",
          "The fallback path should be measurable and reviewable in platform evals.",
        ],
    localArtifacts: {
      testFiles: [
        "tests/resultNormalizer.test.ts",
        "tests/failure-modes.test.ts",
        "tests/evalHandoffBuilder.test.ts",
      ],
      docs: [
        "docs/how-it-fits-with-aip-evals.md",
        "docs/integration-guide.md",
      ],
      examples: [
        "examples/osdk-client-example.ts",
        "examples/eval-handoff-example.ts",
        "examples/eval-handoff-example.json",
      ],
    },
  };
}
